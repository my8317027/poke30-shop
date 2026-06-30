// 応募期間フィルタと地域集計のユーティリティ。
// 表示対象は「応募期間が 2026-06-06 〜 2026-10-31 に重なるもの」だけ。

import { STORES, type Store } from './stores';
import { prefByName } from './regions';
import { municipalitiesOf } from './municipalities';

export const WINDOW_START = '2026-06-06';
export const WINDOW_END = '2026-10-31';

// 文字列日付の単純比較（'YYYY-MM-DD' は辞書順＝時系列順）
export function isActive(store: Store): boolean {
  return store.applyEnd >= WINDOW_START && store.applyStart <= WINDOW_END;
}

// 表示順の重み（受付中→受付予定→受付終了）
const STATUS_ORDER: Record<Store['status'], number> = { open: 0, scheduled: 1, ended: 2 };

// 期間内の店だけ（受付中→受付予定→受付終了 の順に並べる）
export function activeStores(): Store[] {
  return STORES.filter(isActive).sort((a, b) => {
    if (a.status !== b.status) return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    // 受付終了は新しく終わったものを上に、それ以外は開始日順
    if (a.status === 'ended') return b.applyEnd.localeCompare(a.applyEnd);
    return a.applyStart.localeCompare(b.applyStart);
  });
}

// 実店舗・チェーン（地域に紐づくもの）
export function localStores(): Store[] {
  return activeStores().filter((s) => s.type !== 'online');
}

// オンライン専用
export function onlineStores(): Store[] {
  return activeStores().filter((s) => s.type === 'online');
}

// 指定都道府県（name）の店
export function storesInPrefecture(prefName: string): Store[] {
  return localStores().filter((s) => s.prefecture === prefName);
}

// 指定都道府県内の市・区一覧（全市区を表示・各市の応募店数バッジ付き）
export function citiesInPrefecture(prefName: string): { city: string; count: number }[] {
  // 店舗数を市ごとに集計
  const counts = new Map<string, number>();
  for (const s of storesInPrefecture(prefName)) {
    counts.set(s.city, (counts.get(s.city) ?? 0) + 1);
  }
  // 市区マスタ（municipalities.ts）の順番で全市区を返す
  const slug = prefByName(prefName)?.slug ?? '';
  const all = municipalitiesOf(slug);
  // マスタに無い市に店がある場合（research で追加された新市など）も拾う
  for (const city of counts.keys()) {
    if (!all.includes(city)) all.push(city);
  }
  return all.map((city) => ({ city, count: counts.get(city) ?? 0 }));
}

// 指定市の店
export function storesInCity(prefName: string, city: string): Store[] {
  return storesInPrefecture(prefName).filter((s) => s.city === city);
}

// 都道府県ごとの店舗数（フッター等のバッジ用）
export function countByPrefecture(): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of localStores()) {
    map.set(s.prefecture, (map.get(s.prefecture) ?? 0) + 1);
  }
  return map;
}
