// 8地方 → 47都道府県（固定データ）。
// slug はURLに使うローマ字。pages/[pref].astro の getStaticPaths がこれを使う。

export interface Prefecture {
  code: number; // JIS 都道府県コード 1〜47
  name: string; // 表示名（例: 東京都）
  short: string; // 短縮名（例: 東京）フッター表示用
  slug: string; // URL用ローマ字（例: tokyo）
}

export interface Region {
  name: string; // 地方名（例: 関東）
  prefectures: Prefecture[];
}

export const REGIONS: Region[] = [
  {
    name: '北海道・東北',
    prefectures: [
      { code: 1, name: '北海道', short: '北海道', slug: 'hokkaido' },
      { code: 2, name: '青森県', short: '青森', slug: 'aomori' },
      { code: 3, name: '岩手県', short: '岩手', slug: 'iwate' },
      { code: 4, name: '宮城県', short: '宮城', slug: 'miyagi' },
      { code: 5, name: '秋田県', short: '秋田', slug: 'akita' },
      { code: 6, name: '山形県', short: '山形', slug: 'yamagata' },
      { code: 7, name: '福島県', short: '福島', slug: 'fukushima' },
    ],
  },
  {
    name: '関東',
    prefectures: [
      { code: 8, name: '茨城県', short: '茨城', slug: 'ibaraki' },
      { code: 9, name: '栃木県', short: '栃木', slug: 'tochigi' },
      { code: 10, name: '群馬県', short: '群馬', slug: 'gunma' },
      { code: 11, name: '埼玉県', short: '埼玉', slug: 'saitama' },
      { code: 12, name: '千葉県', short: '千葉', slug: 'chiba' },
      { code: 13, name: '東京都', short: '東京', slug: 'tokyo' },
      { code: 14, name: '神奈川県', short: '神奈川', slug: 'kanagawa' },
    ],
  },
  {
    name: '中部',
    prefectures: [
      { code: 15, name: '新潟県', short: '新潟', slug: 'niigata' },
      { code: 16, name: '富山県', short: '富山', slug: 'toyama' },
      { code: 17, name: '石川県', short: '石川', slug: 'ishikawa' },
      { code: 18, name: '福井県', short: '福井', slug: 'fukui' },
      { code: 19, name: '山梨県', short: '山梨', slug: 'yamanashi' },
      { code: 20, name: '長野県', short: '長野', slug: 'nagano' },
      { code: 21, name: '岐阜県', short: '岐阜', slug: 'gifu' },
      { code: 22, name: '静岡県', short: '静岡', slug: 'shizuoka' },
      { code: 23, name: '愛知県', short: '愛知', slug: 'aichi' },
    ],
  },
  {
    name: '近畿',
    prefectures: [
      { code: 24, name: '三重県', short: '三重', slug: 'mie' },
      { code: 25, name: '滋賀県', short: '滋賀', slug: 'shiga' },
      { code: 26, name: '京都府', short: '京都', slug: 'kyoto' },
      { code: 27, name: '大阪府', short: '大阪', slug: 'osaka' },
      { code: 28, name: '兵庫県', short: '兵庫', slug: 'hyogo' },
      { code: 29, name: '奈良県', short: '奈良', slug: 'nara' },
      { code: 30, name: '和歌山県', short: '和歌山', slug: 'wakayama' },
    ],
  },
  {
    name: '中国',
    prefectures: [
      { code: 31, name: '鳥取県', short: '鳥取', slug: 'tottori' },
      { code: 32, name: '島根県', short: '島根', slug: 'shimane' },
      { code: 33, name: '岡山県', short: '岡山', slug: 'okayama' },
      { code: 34, name: '広島県', short: '広島', slug: 'hiroshima' },
      { code: 35, name: '山口県', short: '山口', slug: 'yamaguchi' },
    ],
  },
  {
    name: '四国',
    prefectures: [
      { code: 36, name: '徳島県', short: '徳島', slug: 'tokushima' },
      { code: 37, name: '香川県', short: '香川', slug: 'kagawa' },
      { code: 38, name: '愛媛県', short: '愛媛', slug: 'ehime' },
      { code: 39, name: '高知県', short: '高知', slug: 'kochi' },
    ],
  },
  {
    name: '九州・沖縄',
    prefectures: [
      { code: 40, name: '福岡県', short: '福岡', slug: 'fukuoka' },
      { code: 41, name: '佐賀県', short: '佐賀', slug: 'saga' },
      { code: 42, name: '長崎県', short: '長崎', slug: 'nagasaki' },
      { code: 43, name: '熊本県', short: '熊本', slug: 'kumamoto' },
      { code: 44, name: '大分県', short: '大分', slug: 'oita' },
      { code: 45, name: '宮崎県', short: '宮崎', slug: 'miyazaki' },
      { code: 46, name: '鹿児島県', short: '鹿児島', slug: 'kagoshima' },
      { code: 47, name: '沖縄県', short: '沖縄', slug: 'okinawa' },
    ],
  },
];

// 全47都道府県のフラットなリスト
export const ALL_PREFECTURES: Prefecture[] = REGIONS.flatMap((r) => r.prefectures);

// slug → Prefecture の逆引き
export function prefBySlug(slug: string): Prefecture | undefined {
  return ALL_PREFECTURES.find((p) => p.slug === slug);
}

// 都道府県名 → Prefecture の逆引き（stores.ts は name で県を持つため）
export function prefByName(name: string): Prefecture | undefined {
  return ALL_PREFECTURES.find((p) => p.name === name);
}
