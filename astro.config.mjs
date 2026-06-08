// @ts-check
import { defineConfig } from 'astro/config';

// 静的サイト（SSG）。Cloudflare Workers の静的アセットとして配信するため
// adapter は不要。dist/ をそのまま wrangler でデプロイする。
export default defineConfig({
  site: 'https://poke30-shop.example.com', // 独自ドメイン確定後に差し替え
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
