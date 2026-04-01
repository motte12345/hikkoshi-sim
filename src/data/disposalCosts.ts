// 不用品処分費用データ

export interface DisposalItem {
  readonly id: string;
  readonly name: string;
  readonly category: 'リサイクル家電' | '粗大ゴミ' | '大型家具';
  readonly municipalCost: number;     // 自治体の粗大ゴミ費用（目安）
  readonly recycleFee: number;        // リサイクル料（家電リサイクル法対象のみ）
  readonly collectionFee: number;     // 収集運搬料（リサイクル家電のみ）
  readonly buybackEstimate: number;   // 買取に出した場合の目安（状態良好時）
}

export const disposalItems: readonly DisposalItem[] = [
  // リサイクル家電（家電リサイクル法対象4品目）
  {
    id: 'fridge_small',
    name: '冷蔵庫（170L以下）',
    category: 'リサイクル家電',
    municipalCost: 0,  // 自治体では回収不可
    recycleFee: 3740,
    collectionFee: 3000,
    buybackEstimate: 3000,
  },
  {
    id: 'fridge_large',
    name: '冷蔵庫（171L以上）',
    category: 'リサイクル家電',
    municipalCost: 0,
    recycleFee: 4730,
    collectionFee: 3000,
    buybackEstimate: 5000,
  },
  {
    id: 'washing_machine',
    name: '洗濯機・衣類乾燥機',
    category: 'リサイクル家電',
    municipalCost: 0,
    recycleFee: 2530,
    collectionFee: 3000,
    buybackEstimate: 2000,
  },
  {
    id: 'tv_small',
    name: 'テレビ（15型以下）',
    category: 'リサイクル家電',
    municipalCost: 0,
    recycleFee: 1870,
    collectionFee: 3000,
    buybackEstimate: 1000,
  },
  {
    id: 'tv_large',
    name: 'テレビ（16型以上）',
    category: 'リサイクル家電',
    municipalCost: 0,
    recycleFee: 2970,
    collectionFee: 3000,
    buybackEstimate: 3000,
  },
  {
    id: 'aircon',
    name: 'エアコン',
    category: 'リサイクル家電',
    municipalCost: 0,
    recycleFee: 990,
    collectionFee: 3000,
    buybackEstimate: 2000,
  },
  // 粗大ゴミ・大型家具
  {
    id: 'sofa_2seat',
    name: 'ソファ（2人掛け）',
    category: '大型家具',
    municipalCost: 2000,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 3000,
  },
  {
    id: 'sofa_3seat',
    name: 'ソファ（3人掛け以上）',
    category: '大型家具',
    municipalCost: 2800,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 5000,
  },
  {
    id: 'bed_single',
    name: 'ベッド（シングル）',
    category: '大型家具',
    municipalCost: 1200,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 2000,
  },
  {
    id: 'bed_double',
    name: 'ベッド（ダブル以上）',
    category: '大型家具',
    municipalCost: 2000,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 3000,
  },
  {
    id: 'mattress',
    name: 'マットレス',
    category: '大型家具',
    municipalCost: 1200,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 500,
  },
  {
    id: 'desk',
    name: '机・デスク',
    category: '粗大ゴミ',
    municipalCost: 800,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 1000,
  },
  {
    id: 'bookshelf',
    name: '本棚・シェルフ',
    category: '粗大ゴミ',
    municipalCost: 800,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 500,
  },
  {
    id: 'dining_table',
    name: 'ダイニングテーブル',
    category: '大型家具',
    municipalCost: 1200,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 3000,
  },
  {
    id: 'wardrobe',
    name: 'タンス・ワードローブ',
    category: '大型家具',
    municipalCost: 1200,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 1000,
  },
  {
    id: 'bicycle',
    name: '自転車',
    category: '粗大ゴミ',
    municipalCost: 800,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 1500,
  },
  {
    id: 'microwave',
    name: '電子レンジ',
    category: '粗大ゴミ',
    municipalCost: 400,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 1000,
  },
  {
    id: 'carpet',
    name: 'カーペット・じゅうたん',
    category: '粗大ゴミ',
    municipalCost: 800,
    recycleFee: 0,
    collectionFee: 0,
    buybackEstimate: 0,
  },
] as const;
