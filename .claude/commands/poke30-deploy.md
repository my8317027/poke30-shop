---
description: Cloudflare にデプロイして、たくさんの人が見られるよう公開する
---

# poke30-deploy — Cloudflare に公開する

ビルド済みサイトを Cloudflare Workers（静的アセット配信）に公開するスキル。
たくさんの人が同時に見ても落ちない構成。

## 前提
- `wrangler.jsonc` に `name: "poke30-shop"` と `assets.directory: "./dist"` が設定済み。
- 初回のみ Cloudflare ログインが必要:
  ```bash
  cd "/Users/yugamotoyama/Downloads/Dラボ　/ポケモンカード" && npx wrangler login
  ```
  （ブラウザが開くのでユーザーが許可する）

## 手順

1. **公開前チェック**：先に `poke30-check` を必ず通す（壊れたまま公開しない）。

2. **ビルド＆デプロイ**
   ```bash
   cd "/Users/yugamotoyama/Downloads/Dラボ　/ポケモンカード" && npm run build && npx wrangler deploy
   ```
   - 成功すると `https://poke30-shop.<account>.workers.dev` のような公開URLが表示される。
     そのURLをユーザーに伝える。

3. **動作確認**：公開URLをブラウザで開き、トップ→都道府県→市→店まで表示されるか確認。

## 独自ドメインの接続（ドメイン確定後）
1. ユーザーがドメインを取得し、Cloudflare にサイト（ゾーン）を追加。
2. `wrangler.jsonc` に routes を追加するか、Cloudflare ダッシュボードの
   Workers & Pages → 対象Worker → Settings → Domains & Routes で「Custom Domain」を追加。
3. 反映後、独自ドメインで表示されることを確認。
   - 手順はその都度ユーザーに画面操作を案内する（ユーザーはブラウザ操作担当）。

## 毎日の更新フロー（まとめ）
`poke30-research`（店を調べる）→ `poke30-check`（確認）→ `poke30-deploy`（公開）
