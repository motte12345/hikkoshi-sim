// 単身パック 料金データ

export interface TanshinPack {
  readonly carrier: string;
  readonly planName: string;
  readonly maxBoxes: number;        // 段ボール換算の最大数
  readonly allowsLargeFurniture: boolean;
  readonly basePriceNear: number;   // 近距離（〜50km）
  readonly basePriceMid: number;    // 中距離（〜200km）
  readonly basePriceFar: number;    // 遠距離（200km〜）
  readonly note: string;
}

export const tanshinPacks: readonly TanshinPack[] = [
  {
    carrier: '日通',
    planName: '単身パックS',
    maxBoxes: 16,
    allowsLargeFurniture: false,
    basePriceNear: 19800,
    basePriceMid: 22000,
    basePriceFar: 29000,
    note: '小さめの荷物向け。冷蔵庫（2ドア）まで。',
  },
  {
    carrier: '日通',
    planName: '単身パックL',
    maxBoxes: 30,
    allowsLargeFurniture: true,
    basePriceNear: 22000,
    basePriceMid: 25000,
    basePriceFar: 35000,
    note: '洗濯機・冷蔵庫など大型家電も可。',
  },
  {
    carrier: 'ヤマトホームコンビニエンス',
    planName: 'わたしの引越',
    maxBoxes: 15,
    allowsLargeFurniture: false,
    basePriceNear: 18000,
    basePriceMid: 21000,
    basePriceFar: 28000,
    note: '専用ボックス1本分。家具少なめの方向け。',
  },
  {
    carrier: 'サカイ引越センター',
    planName: '小口引越便',
    maxBoxes: 20,
    allowsLargeFurniture: true,
    basePriceNear: 25000,
    basePriceMid: 30000,
    basePriceFar: 40000,
    note: '混載便。到着に数日かかる場合あり。',
  },
  {
    carrier: 'アート引越センター',
    planName: '単身引越パック',
    maxBoxes: 25,
    allowsLargeFurniture: true,
    basePriceNear: 28000,
    basePriceMid: 33000,
    basePriceFar: 45000,
    note: '大型家具も対応。丁寧な作業が特徴。',
  },
] as const;

// 段ボール数から単身パックに収まるか判定
export function fitsTanshinPack(
  boxCount: number,
  hasLargeFurniture: boolean,
  pack: TanshinPack
): boolean {
  if (hasLargeFurniture && !pack.allowsLargeFurniture) return false;
  // 大型家具がある場合は段ボール換算で+5として計算
  const effectiveBoxes = hasLargeFurniture ? boxCount + 5 : boxCount;
  return effectiveBoxes <= pack.maxBoxes;
}

// 距離に応じた料金を返す
export function getTanshinPrice(pack: TanshinPack, distanceKm: number): number {
  if (distanceKm <= 50) return pack.basePriceNear;
  if (distanceKm <= 200) return pack.basePriceMid;
  return pack.basePriceFar;
}
