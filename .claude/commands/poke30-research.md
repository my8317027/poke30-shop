---
description: ポケカ30周年に応募できる店をWeb調査し、出典付きで stores.ts に追記する（店を調べるスキル）
---

# poke30-research — 店を調べる

ポケモンカード30周年「30th CELEBRATION」の**抽選・先着・予約応募**を受け付ける店を
Webで調べ、`src/data/stores.ts` に**出典付きで**追記するスキル。毎日の更新の中心。

## 鉄則（最重要）
- **状態を必ず区別する。** `status: 'open'`（受付中・日程確定）と `status: 'scheduled'`（受付予定・日程は予想）。
  - `open`：受付期間が確定し、実際に応募できる店。`applyStart`/`applyEnd` は確定値。
  - `scheduled`：参加見込みだが日程未確定の店。`scheduleNote` に「受付時期：8月中旬〜9月上旬ごろ（予想・要確認）」等を必ず入れる。
    予想日程は `applyStart`/`applyEnd` に妥当な見込み値（例 2026-08-15〜2026-09-16）を入れる。
- **嘘は書かない。** 確定していないものを `open` にしない。予想は必ず `scheduled` ＋ scheduleNote で「予想」と明示。
- 各エントリには必ず `source`（出典URLまたは媒体名）と `url`（応募/告知ページ）を入れる。出典ゼロの店名は載せない。
- **url のルール（サイトの生命線）**:
  - `open`（受付中）は、**実際に応募できる具体的ページの直リンク**にする（例: Amazon商品ページ /dp/ASIN、各店の抽選応募ページ）。
    トップページや浅いURLは禁止（validate.ts がビルドを失敗させる）。`open` にする前に必ずそのURLを開いて応募できる状態か確認する。
  - `scheduled`（受付予定）は応募ページがまだ無いので、店の公式トップ/特設ページでよい（ボタンは自動で「店舗ページを見る」になる）。
  - 追記後は `npm run check:links` でリンク生存を確認する。
- 応募期間が **2026-06-06 〜 2026-10-31 に重なるものだけ**を対象にする（範囲外は載せない）。
- 既存の `id` と重複させない。同じ店の情報が更新されていたら、新規追加ではなく既存を上書き更新する。
  - **`scheduled` の店が正式告知で受付開始したら、`status: 'open'` に変えて確定日程・条件に更新する**（毎日の主な仕事）。

## 手順

1. **検索する**（WebSearch を複数並列で）。クエリ例:
   - `ポケカ 30th CELEBRATION 抽選 応募 店舗 <都道府県名>`
   - `ポケモンカード 30周年 予約 先着 <チェーン名>（ヨドバシ/ビックカメラ/イオン/ゲオ/カードショップ等）`
   - `ポケカ 30周年 抽選 まとめ 2026`（nyuka-now.com / 攻略大百科 / スニーカーダンク 等のまとめ）
2. **一次情報に近づく**。まとめ記事で店名が出たら、可能な限り各店公式の告知ページを WebFetch で確認し、
   応募期間・対象商品・方式（抽選/先着/予約）・**応募条件**を取る。
3. **条件を抽出する**（`conditions` に箇条書き）。よくある条件:
   - 「対象商品◯◯円以上の購入が必要」「アプリ/メルマガ会員限定」「店頭で抽選券配布」
   - 「お一人様1点まで」「過去の購入履歴が必要」「来店応募のみ」 など
   - 条件が見当たらなければ `conditions: []`（カードでは「記載なし」と表示される）。
4. **type を判定する**:
   - `physical` … 地域の独立店（カードショップ等）→ prefecture/city 必須
   - `chain` … 全国チェーンの個別支店 → prefecture/city 必須（支店ごとに1エントリ）
   - `online` … ネット専用（Amazon/ポケセンオンライン/各社EC）→ prefecture/city は '-'
5. **stores.ts に追記する**。`id` は `店名-商品` をローマ字/英数のkebab-caseで一意に。
   `prefecture` は regions.ts の `name`（例: '東京都'）と完全一致させる。`lastUpdated` は今日の日付。
6. **件数を報告する**。今日追加/更新した店数と、地域の内訳をユーザーに伝える。

## 追記フォーマット（コピーして使う）

受付中（確定）の例:
```ts
{
  id: 'cardshop-xxx-tokyo-akihabara',
  name: 'カードショップ〇〇 秋葉原店',
  type: 'physical',
  status: 'open',
  prefecture: '東京都',
  city: '千代田区',
  address: '東京都千代田区...',
  applyStart: '2026-09-01',
  applyEnd: '2026-09-15',
  product: '30th CELEBRATION BOX',
  method: '抽選',
  conditions: ['店頭で抽選券を配布', 'お一人様1点まで'],
  url: 'https://...（応募/告知ページ）',
  source: 'https://...（出典）',
  lastUpdated: 'YYYY-MM-DD',
},
```

受付予定（日程は予想）の例:
```ts
{
  id: 'shop-yyy-web-30th',
  name: '〇〇（WEB抽選）',
  type: 'online',
  status: 'scheduled',
  prefecture: '-',
  city: '-',
  applyStart: '2026-08-15',
  applyEnd: '2026-09-16',
  scheduleNote: '受付時期：8月中旬〜9月上旬ごろ（予想・要確認）',
  product: '30th CELEBRATION 各種',
  method: '抽選',
  conditions: ['受付開始日・条件は正式告知待ち'],
  url: 'https://...',
  source: 'https://...（参加見込みとして掲載しているまとめ等）',
  lastUpdated: 'YYYY-MM-DD',
},
```

## 仕上げ
- 追記後は `poke30-check` を促す（ビルド・データ検証）。
