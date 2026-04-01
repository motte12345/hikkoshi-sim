// 引越し費用 料金テーブル

export type LayoutType = '1R' | '1K' | '1DK' | '1LDK' | '2K' | '2DK' | '2LDK' | '3K' | '3DK' | '3LDK' | '4LDK' | '5LDK';
export type VolumeType = '少なめ' | '普通' | '多め';

export const LAYOUTS: LayoutType[] = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K', '3DK', '3LDK', '4LDK', '5LDK'];

export const VOLUMES: VolumeType[] = ['少なめ', '普通', '多め'];

// 間取り × 荷物量 → 基本料金（円）
export const basePriceByLayout: Record<LayoutType, Record<VolumeType, number>> = {
  '1R':   { '少なめ': 25000, '普通': 33000, '多め': 42000 },
  '1K':   { '少なめ': 28000, '普通': 36000, '多め': 45000 },
  '1DK':  { '少なめ': 32000, '普通': 42000, '多め': 52000 },
  '1LDK': { '少なめ': 40000, '普通': 52000, '多め': 65000 },
  '2K':   { '少なめ': 42000, '普通': 55000, '多め': 68000 },
  '2DK':  { '少なめ': 48000, '普通': 62000, '多め': 78000 },
  '2LDK': { '少なめ': 55000, '普通': 72000, '多め': 90000 },
  '3K':   { '少なめ': 58000, '普通': 75000, '多め': 95000 },
  '3DK':  { '少なめ': 62000, '普通': 82000, '多め': 105000 },
  '3LDK': { '少なめ': 70000, '普通': 92000, '多め': 120000 },
  '4LDK': { '少なめ': 85000, '普通': 110000, '多め': 145000 },
  '5LDK': { '少なめ': 100000, '普通': 130000, '多め': 170000 },
};

// 間取りごとのデフォルト荷物量
export const defaultVolumeByLayout: Record<LayoutType, VolumeType> = {
  '1R': '少なめ',
  '1K': '少なめ',
  '1DK': '普通',
  '1LDK': '普通',
  '2K': '普通',
  '2DK': '普通',
  '2LDK': '普通',
  '3K': '多め',
  '3DK': '多め',
  '3LDK': '多め',
  '4LDK': '多め',
  '5LDK': '多め',
};

// 距離加算
export const distanceSurcharges = [
  { maxKm: 15, price: 0, label: '〜15km（同一市区町村）' },
  { maxKm: 50, price: 10000, label: '〜50km（同一都道府県）' },
  { maxKm: 200, price: 25000, label: '〜200km（近隣地方）' },
  { maxKm: 500, price: 45000, label: '〜500km（遠距離）' },
  { maxKm: Infinity, price: 70000, label: '500km超（長距離）' },
] as const;

// 月別 繁忙期係数
export const seasonMultipliers: Record<number, { multiplier: number; label: string }> = {
  1:  { multiplier: 1.0, label: '通常期' },
  2:  { multiplier: 1.1, label: 'やや繁忙' },
  3:  { multiplier: 1.5, label: '繁忙期（最も高い）' },
  4:  { multiplier: 1.3, label: '繁忙期' },
  5:  { multiplier: 1.0, label: '通常期' },
  6:  { multiplier: 1.0, label: '通常期' },
  7:  { multiplier: 1.0, label: '通常期' },
  8:  { multiplier: 1.05, label: 'やや繁忙' },
  9:  { multiplier: 1.05, label: 'やや繁忙' },
  10: { multiplier: 1.0, label: '通常期' },
  11: { multiplier: 1.0, label: '通常期' },
  12: { multiplier: 1.1, label: 'やや繁忙' },
};

// 曜日係数
export const dayTypeMultipliers = {
  '平日': { multiplier: 1.0, label: '平日' },
  '土日祝': { multiplier: 1.15, label: '土日祝（+15%）' },
} as const;
export type DayType = keyof typeof dayTypeMultipliers;

// 時間帯係数
export const timeSlotMultipliers = {
  '午前便': { multiplier: 1.1, label: '午前便（+10%）' },
  '午後便': { multiplier: 1.0, label: '午後便' },
  'フリー便': { multiplier: 0.85, label: 'フリー便（-15%）' },
} as const;
export type TimeSlot = keyof typeof timeSlotMultipliers;

// オプション料金
export interface OptionItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly description: string;
}

export const options: readonly OptionItem[] = [
  { id: 'aircon', name: 'エアコン脱着', price: 15000, description: '取り外し・取り付け' },
  { id: 'piano', name: 'ピアノ運搬', price: 30000, description: 'アップライトピアノ' },
  { id: 'washing', name: '洗濯機設置', price: 8000, description: '取り付け・試運転' },
  { id: 'disposal', name: '不用品処分', price: 10000, description: '少量の不用品引き取り' },
  { id: 'packing', name: '荷造りサービス', price: 25000, description: '小物の梱包代行' },
  { id: 'cleaning', name: 'ハウスクリーニング', price: 30000, description: '退去時の清掃' },
  { id: 'antenna', name: 'アンテナ脱着', price: 12000, description: 'TVアンテナ取り外し・設置' },
] as const;

// レンジ係数（±15%）
export const RANGE_FACTOR = 0.15;
