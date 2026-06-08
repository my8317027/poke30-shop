---
description: ポケカ30周年サイトの雛形セットアップ・依存インストール・ローカルプレビュー起動
---

# poke30-build — サイトを作る / 動かす

ポケカ30周年 応募店舗まとめサイトのセットアップとローカル起動を行うスキル。

## 前提
- プロジェクトルート: `/Users/yugamotoyama/Downloads/Dラボ　/ポケモンカード/`
- 技術構成: Astro（静的SSG）+ Cloudflare Workers（静的アセット配信）

## 手順

1. **依存のインストール**（初回 or package.json 変更時のみ）
   ```bash
   cd "/Users/yugamotoyama/Downloads/Dラボ　/ポケモンカード" && npm install
   ```

2. **本番ビルドの確認**（型・ルーティングが壊れていないか）
   ```bash
   cd "/Users/yugamotoyama/Downloads/Dラボ　/ポケモンカード" && npm run build
   ```
   - エラーが出たら内容を読んで修正する。`dist/` が生成されれば成功。

3. **ローカルプレビュー起動**（ユーザーがブラウザで確認するため）
   ```bash
   cd "/Users/yugamotoyama/Downloads/Dラボ　/ポケモンカード" && npm run dev
   ```
   - 表示された `http://localhost:4321` をユーザーに伝える。
   - dev サーバーはバックグラウンドで起動し、確認が済んだら止める。

## 構成の要点（迷ったらここを見る）
- データの単一ソース: `src/data/stores.ts`（店を増やすのはここ）
- 47都道府県の定義: `src/data/regions.ts`（基本いじらない）
- 期間・地域フィルタ: `src/data/filter.ts`
- 画面: `src/pages/`（index / [pref] / [pref]/[city] / online / 404）
- 部品: `src/components/`（Footer / StoreCard）、`src/layouts/Layout.astro`

## やってはいけないこと
- 出典(source)のないデータを追加しない（research スキルの責務）。
- regions.ts の slug を勝手に変えない（既存URLが壊れる）。
