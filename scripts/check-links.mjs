// 全店舗の url に実際にアクセスして、リンクが生きているかを確認するスクリプト。
// 実行: npm run check:links
//
// 判定:
//   ✅ 200番台 … 生きている
//   🔒 403/405/406/429 … サーバがボットを拒否（人がブラウザで開けばOK。URL自体は有効とみなす）
//   ❌ 404/410/5xx/接続不可 … リンク切れの可能性大（要修正）
//
// 受付中(open)の店が ❌ だった場合は exit code 1 で失敗させる（＝公開を止める）。

import { STORES } from '../src/data/stores.ts';

const TIMEOUT_MS = 15000;
// 一部サイトはデフォルトのfetchを弾くため、ブラウザ風のUAを付ける
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept-Language': 'ja,en;q=0.8',
};
const BOT_BLOCK = new Set([401, 403, 405, 406, 429]);

async function probeOnce(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // まず GET（HEAD非対応サイトが多いため）。リダイレクトは追従。
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: HEADERS,
      signal: ctrl.signal,
    });
    return { status: res.status, finalUrl: res.url };
  } catch (e) {
    return { status: 0, error: e?.cause?.code || e?.name || String(e) };
  } finally {
    clearTimeout(t);
  }
}

// 接続失敗(0)や5xxは一時的なことが多いので最大3回までリトライ
async function probe(url) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 800 * attempt));
    last = await probeOnce(url);
    if (!(last.status === 0 || last.status >= 500)) return last;
  }
  return last;
}

function classify(status) {
  if (status >= 200 && status < 300) return 'ok';
  if (BOT_BLOCK.has(status)) return 'blocked';
  return 'bad';
}

// 並列実行(同時8件)。店舗数が増えても全体が数十秒で終わるようにする。
const CONCURRENCY = 8;
async function runPool(items, worker) {
  const out = new Array(items.length);
  let next = 0;
  async function lane() {
    while (next < items.length) {
      const i = next++;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, lane));
  return out;
}

const results = await runPool(STORES, async (s) => {
  const r = await probe(s.url);
  const kind = classify(r.status);
  return { s, r, kind };
});

for (const { s, r, kind } of results) {
  const icon = kind === 'ok' ? '✅' : kind === 'blocked' ? '🔒' : '❌';
  const detail = r.status ? `HTTP ${r.status}` : `接続失敗(${r.error})`;
  console.log(`${icon} [${s.status}] ${s.name}`);
  console.log(`     ${s.url}  → ${detail}`);
  if (r.finalUrl && r.finalUrl !== s.url) console.log(`     最終URL: ${r.finalUrl}`);
}

// サマリ
const ok = results.filter((x) => x.kind === 'ok').length;
const blocked = results.filter((x) => x.kind === 'blocked').length;
const bad = results.filter((x) => x.kind === 'bad');
console.log(`\n— 結果: ✅${ok}件 / 🔒${blocked}件(ボット拒否=人は開ける) / ❌${bad.length}件`);

// 受付中(open)の店が ❌ なら致命的。失敗させる。
const openBad = bad.filter((x) => x.s.status === 'open');
if (openBad.length > 0) {
  console.error('\n🚨 受付中(open)の店でリンク切れの可能性があります（要修正）:');
  for (const x of openBad) console.error(`   - ${x.s.name}: ${x.s.url}`);
  process.exit(1);
}
if (bad.length > 0) {
  console.warn('\n⚠️ 受付予定(scheduled)で要確認のリンクがあります（致命的ではないが見直し推奨）:');
  for (const x of bad) console.warn(`   - ${x.s.name}: ${x.s.url}`);
}
console.log('\n受付中の店のリンクは全て有効です。');
