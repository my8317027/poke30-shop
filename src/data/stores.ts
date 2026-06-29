// ★毎日ここを更新する★ 店舗・応募情報の単一ソース。
// 追記は poke30-research skill が行う。出典(source)なしのデータは載せないこと。
//
// type の使い分け:
//   physical … 地域に紐づく実店舗（カードショップ等）。prefecture/city 必須。
//   chain    … 全国チェーンの個別支店（家電量販店の支店等）。prefecture/city 必須。
//   online   … オンライン専用応募（Amazon等）。prefecture/city は '-' でよい。

export type ApplyType = 'physical' | 'chain' | 'online';
export type ApplyMethod = '抽選' | '先着' | '予約';
// open … 受付中（日程確定）／ scheduled … 受付予定（日程は予想・未確定）
export type ApplyStatus = 'open' | 'scheduled';

export interface Store {
  id: string; // 一意キー（重複防止）。例: 'amazon-30th-box'
  name: string; // 店名
  type: ApplyType;
  status: ApplyStatus; // 受付中 or 受付予定
  prefecture: string; // 都道府県名（regions.ts の name と一致）。online は '-'
  city: string; // 市区町村名。online は '-'
  address?: string;
  applyStart: string; // 'YYYY-MM-DD'（scheduled の場合は予想値でよい）
  applyEnd: string; // 'YYYY-MM-DD'（scheduled の場合は予想値でよい）
  scheduleNote?: string; // scheduled 用の補足。例: '受付時期：8月中旬〜9月上旬ごろ（予想・要確認）'
  product: string; // 対象商品。例: '30th CELEBRATION BOX'
  method: ApplyMethod;
  conditions: string[]; // 応募条件。なければ []
  url: string; // 応募ページ / 公式告知URL
  source: string; // 情報の出典（裏取り用URLや媒体名）
  lastUpdated: string; // 'YYYY-MM-DD'
}

// ─────────────────────────────────────────────
// 初期データ（2026-06-08 時点で確認できたオンライン応募中心）
// ※実店舗情報はこれから poke30-research で毎日積み増していく
// ─────────────────────────────────────────────
export const STORES: Store[] = [
  {
    id: 'amazon-30th-celebration-box',
    name: 'Amazon.co.jp（30th CELEBRATION BOX 招待リクエスト）',
    type: 'online',
    status: 'open',
    prefecture: '-',
    city: '-',
    applyStart: '2026-06-02',
    applyEnd: '2026-09-16',
    product: '30th CELEBRATION BOX（20パック入り）',
    method: '抽選',
    conditions: [
      '商品ページから「リクエストの送信」で招待を申し込む',
      '招待された人のみ購入可能（招待販売）',
      'お一人様1BOXまで',
    ],
    url: 'https://www.amazon.co.jp/dp/B0GXCRBL5J',
    source: '攻略大百科 2026-06-07更新 / nyuka-now.com（ASIN: B0GXCRBL5J 実在確認済み）',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'nojima-online-secret-sale-30th',
    name: 'ノジマオンライン（シークレット販売会エントリー）',
    type: 'online',
    status: 'open',
    prefecture: '-',
    city: '-',
    applyStart: '2026-06-10',
    applyEnd: '2026-09-16',
    product: 'シークレット販売会の対象商品（ポケカ等。30th CELEBRATION もこの枠で扱う見込み）',
    method: '抽選',
    conditions: [
      'ノジマオンライン会員IDが必要',
      '複数IDでのエントリーは無効',
      '30th CELEBRATION 専用ではなく対象商品全般のエントリー（対象に含まれるか要確認）',
    ],
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSe2tm0oG-L8fBGGdkqdWNJD2NRkl7IHSWxGKKcFoU_u0-K1Ow/viewform',
    source: 'nyuka-now.com 2026-06 ／ フォーム「2026.6.10〜受付分 シークレット販売会」受付中を確認',
    lastUpdated: '2026-06-29',
  },
  {
    id: 'pokemon-center-online-futuristic-box',
    name: 'ポケモンセンターオンライン（30th CELEBRATION FUTURISTIC BOX）',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-16',
    applyEnd: '2026-09-16',
    scheduleNote: '抽選の受付開始は2026年7月以降にお知らせで告知予定（予想：8月中〜下旬・要確認）。6/29時点で未受付。',
    product: '30th CELEBRATION FUTURISTIC BOX ほか30周年記念商品',
    method: '抽選',
    conditions: [
      'FUTURISTIC BOX はポケモンセンターオンライン限定の取り扱い',
      'ポケモンセンターオンラインの会員登録が必要',
      'マイナンバーカードによる本人確認システムを導入予定（当選率に影響する場合あり）',
    ],
    url: 'https://www.pokemoncenter-online.com/feature/30th.html',
    source: 'ポケモンセンターオンライン公式 30th特集 / お知らせ 2026-06 / 攻略大百科',
    lastUpdated: '2026-06-29',
  },

  // ───── 受付予定（scheduled）：過去実績・各トラッカーが参加見込みとして掲載 ─────
  // ※日程は予想。受付開始日・条件は各店の正式告知で要確認。発売1ヶ月前(8月中旬〜)に確定する見込み。
  {
    id: 'seven-net-30th-celebration',
    name: 'セブンネットショッピング（アプリ抽選）',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-06-30',
    applyEnd: '2026-07-15',
    scheduleNote: '受付：2026年6月30日(火)15:00頃〜7月15日(水)23:59 予定（要確認）。6/29時点では未受付。開始後はセブンネットアプリから応募。',
    product: '30th CELEBRATION BOX／プレミアムデッキセット エーフィ・ブラッキー',
    method: '抽選',
    conditions: [
      '2025/6/1〜2026/6/14 にセブンネットで税抜1円以上の注文＆受取の履歴が必要',
      'セブンネットショッピングアプリからの応募',
      '商品受取期間 2026/10/2〜10/15',
    ],
    url: 'https://7net.omni7.jp/',
    source: 'inside-games 2026-06-16 ／ meli-melo.blog.jp',
    lastUpdated: '2026-06-29',
  },
  {
    id: 'rakuten-books-30th-celebration',
    name: '楽天ブックス（30th CELEBRATION）',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：8月中旬〜9月上旬ごろ（予想・要確認）',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['楽天会員登録が必要（見込み）', '受付開始日・条件は正式告知待ち'],
    url: 'https://books.rakuten.co.jp/',
    source: 'nyuka-now.com 抽選まとめ（参加見込み店として掲載）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'yodobashi-30th-celebration',
    name: 'ヨドバシ.com / ヨドバシカメラ',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：8月中旬〜9月上旬ごろ（予想・要確認）。発売日当日の店頭先着販売も見込み',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['ヨドバシ会員登録が必要（見込み）', '受付開始日・条件は正式告知待ち'],
    url: 'https://www.yodobashi.com/',
    source: 'nyuka-now.com / gamenv 抽選まとめ（参加見込み店）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'bic-camera-30th-celebration',
    name: 'ビックカメラ.com / ビックカメラ',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：8月中旬〜9月上旬ごろ（予想・要確認）',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['ビックカメラ会員/アプリが必要な場合あり（見込み）', '受付開始日・条件は正式告知待ち'],
    url: 'https://www.biccamera.com/',
    source: 'nyuka-now.com / gamenv 抽選まとめ（参加見込み店）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'aeon-style-online-30th-celebration',
    name: 'イオンスタイルオンライン / イオン',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：8月中旬〜9月上旬ごろ（予想・要確認）。応募は店頭中心の見込み',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['受付開始日・条件は正式告知待ち', '応募は店頭/イオン各通販のいずれかになる見込み'],
    url: 'https://www.aeon.com/',
    source: 'nyuka-now.com 抽選まとめ（参加見込み店）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'toysrus-30th-celebration',
    name: 'トイザらス（オンライン/店舗）',
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
    url: 'https://www.toysrus.co.jp/',
    source: 'nyuka-now.com 抽選まとめ（参加見込み店）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'cardlabo-web-30th-celebration',
    name: 'カードラボ（WEB抽選）',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：発売1ヶ月前ごろ（予想・要確認）。現在トラッカーでは「調査中」',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['会員登録・購入履歴などの条件が付く場合あり（過去実績より見込み）', '受付開始日・条件は正式告知待ち'],
    url: 'https://www.c-labo-online.jp/',
    source: 'pokecawatch / mikeco-room 抽選まとめ（参加見込み・調査中として掲載）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'hareruya2-web-30th-celebration',
    name: '晴れる屋2（WEB抽選）',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：発売1ヶ月前ごろ（予想・要確認）。現在トラッカーでは「調査中」',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['受付開始日・条件は正式告知待ち'],
    url: 'https://www.hareruya2.com/',
    source: 'pokecawatch / mikeco-room 抽選まとめ（参加見込み・調査中として掲載）2026-06',
    lastUpdated: '2026-06-08',
  },
  {
    id: 'hobbystation-web-30th-celebration',
    name: 'ホビーステーション（WEB抽選）',
    type: 'online',
    status: 'scheduled',
    prefecture: '-',
    city: '-',
    applyStart: '2026-08-15',
    applyEnd: '2026-09-16',
    scheduleNote: '受付時期：発売1ヶ月前ごろ（予想・要確認）。現在トラッカーでは「調査中」',
    product: '30th CELEBRATION 各種',
    method: '抽選',
    conditions: ['受付開始日・条件は正式告知待ち'],
    url: 'https://www.hbst.net/',
    source: 'pokecawatch / mikeco-room 抽選まとめ（参加見込み・調査中として掲載）2026-06',
    lastUpdated: '2026-06-08',
  },
];
