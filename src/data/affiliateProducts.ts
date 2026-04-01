const AMAZON_TAG = 'qp2026-22';
const RAKUTEN_ID = '526c1e79.46d4a30e.526c1e7a.3db24b05';

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  amazonSearchQuery: string;
  rakutenSearchQuery: string;
}

export const affiliateProducts: AffiliateProduct[] = [
  {
    id: 'cardboard',
    name: '段ボール（引越しセット）',
    description: '大・中・小サイズ混合の引越し用段ボールセット。まとめ買いがお得です。',
    amazonSearchQuery: '段ボール+引越しセット',
    rakutenSearchQuery: '段ボール+引越しセット',
  },
  {
    id: 'packing-tape',
    name: 'ガムテープ・梱包テープ',
    description: '段ボール封函に欠かせないクラフトテープ・OPPテープ。複数本まとめて準備を。',
    amazonSearchQuery: 'ガムテープ+梱包テープ+引越し',
    rakutenSearchQuery: 'ガムテープ+梱包テープ+引越し',
  },
  {
    id: 'bubble-wrap',
    name: 'プチプチ（気泡緩衝材）',
    description: '食器・家電の梱包に必須の気泡緩衝材。ロールタイプが使いやすくおすすめです。',
    amazonSearchQuery: 'プチプチ+気泡緩衝材+ロール',
    rakutenSearchQuery: 'プチプチ+気泡緩衝材+ロール',
  },
  {
    id: 'futon-bag',
    name: '布団袋・布団圧縮袋',
    description: '羽毛布団・毛布をコンパクトに梱包できる圧縮袋。かさばる布団の輸送に便利です。',
    amazonSearchQuery: '布団袋+引越し+圧縮',
    rakutenSearchQuery: '布団袋+引越し+圧縮',
  },
  {
    id: 'clothes-storage',
    name: '衣類収納ボックス・不織布袋',
    description: 'ハンガーのまま衣類を収納できるボックスや不織布カバー。シワを防ぎながら運べます。',
    amazonSearchQuery: '衣類収納ボックス+引越し+ハンガー',
    rakutenSearchQuery: '衣類収納ボックス+引越し+ハンガー',
  },
  {
    id: 'masking-tape',
    name: '養生テープ',
    description: '床・壁・家具の保護に使う養生テープ。剥がしやすく跡が残らないタイプが最適です。',
    amazonSearchQuery: '養生テープ+引越し',
    rakutenSearchQuery: '養生テープ+引越し',
  },
];

export function getAmazonSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.amazon.co.jp/s?k=${encoded}&tag=${AMAZON_TAG}`;
}

export function getRakutenSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${encoded}%2F`;
}
