// ビルド時に走るデータ整合性チェック。index.astro から呼ぶ。
// 問題があれば例外を投げてビルドを失敗させる（＝壊れたデータは公開されない）。

import { STORES } from './stores';
import { ALL_PREFECTURES } from './regions';
import { WINDOW_START, WINDOW_END } from './filter';

const prefNames = new Set(ALL_PREFECTURES.map((p) => p.name));
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateStores(): { ok: true; count: number } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const s of STORES) {
    const where = `[${s.id ?? '(idなし)'}] ${s.name ?? ''}`;

    if (!s.id) errors.push(`${where}: id がありません`);
    else if (ids.has(s.id)) errors.push(`${where}: id が重複しています`);
    else ids.add(s.id);

    if (!s.name) errors.push(`${where}: name がありません`);
    if (!s.url) errors.push(`${where}: url（応募/告知ページ）がありません`);
    if (!s.source) errors.push(`${where}: source（出典）がありません`);
    if (s.status !== 'open' && s.status !== 'scheduled' && s.status !== 'ended') {
      errors.push(`${where}: status は 'open' / 'scheduled' / 'ended' のいずれかにしてください (${s.status})`);
    }

    // ★最重要★ url の健全性チェック
    // 受付中(open)の店は「実際に応募できる具体的なページ」への直リンクでなければならない。
    // トップページ等の浅いURL（パスが無い/ '/' だけ）を open に使うのを禁止する。
    let parsed: URL | undefined;
    if (s.url) {
      try {
        parsed = new URL(s.url);
      } catch {
        errors.push(`${where}: url が正しいURL形式ではありません (${s.url})`);
      }
    }
    if (parsed && parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      errors.push(`${where}: url は http(s) で始めてください (${s.url})`);
    }
    if (s.status === 'open' && parsed) {
      const path = parsed.pathname.replace(/\/+$/, ''); // 末尾スラッシュを除去
      const hasQuery = parsed.search.length > 1;
      if (path === '' && !hasQuery) {
        errors.push(
          `${where}: 受付中(open)はトップページ等ではなく、実際に応募できる具体的ページのURLが必要です (${s.url})`,
        );
      }
    }
    // 受付予定（日程が予想）には scheduleNote を必須にして、ユーザーに「予想」と伝わるようにする
    if (s.status === 'scheduled' && !s.scheduleNote) {
      errors.push(`${where}: scheduled には scheduleNote（受付時期の予想・注意書き）が必要です`);
    }

    if (!DATE_RE.test(s.applyStart)) errors.push(`${where}: applyStart の形式が不正 (${s.applyStart})`);
    if (!DATE_RE.test(s.applyEnd)) errors.push(`${where}: applyEnd の形式が不正 (${s.applyEnd})`);
    if (DATE_RE.test(s.applyStart) && DATE_RE.test(s.applyEnd) && s.applyStart > s.applyEnd) {
      errors.push(`${where}: applyStart が applyEnd より後になっています`);
    }

    // 期間ウィンドウとの整合（範囲外を載せてしまっていないか）
    if (s.applyEnd < WINDOW_START || s.applyStart > WINDOW_END) {
      errors.push(
        `${where}: 応募期間が掲載対象 (${WINDOW_START}〜${WINDOW_END}) から外れています`,
      );
    }

    // 地域に紐づく店は都道府県名が regions.ts と一致している必要がある
    if (s.type === 'physical' || s.type === 'chain') {
      if (!prefNames.has(s.prefecture)) {
        errors.push(`${where}: prefecture '${s.prefecture}' が47都道府県名と一致しません`);
      }
      if (!s.city || s.city === '-') {
        errors.push(`${where}: 実店舗/チェーンには city が必要です`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `stores.ts のデータ検証に失敗しました（${errors.length}件）:\n - ` + errors.join('\n - '),
    );
  }
  return { ok: true, count: STORES.length };
}
