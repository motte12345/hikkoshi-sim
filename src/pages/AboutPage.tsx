import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function AboutPage() {
  return (
    <>
      <Seo
        title="概要・免責事項"
        description="引越し費用シミュレーターの概要、免責事項、広告についての説明ページです。"
        path="/about"
      />
      <h1 className="page-title">概要・免責事項</h1>

      <div className="card">
        <h2 className="card__title">サイトについて</h2>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
          「引越し費用シミュレーター」は、引越しにかかる費用の概算を
          手軽にシミュレーションできる無料のWebツールです。
        </p>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginTop: '0.75rem' }}>
          間取り・移動距離・引越し時期などの条件から概算費用を算出し、
          引越し計画の参考にしていただくことを目的としています。
        </p>
      </div>

      <div className="card">
        <h2 className="card__title">提供ツール</h2>
        <ul style={{ fontSize: '0.9rem', lineHeight: 2, paddingLeft: '1.5rem' }}>
          <li><Link to="/estimate">引越し費用シミュレーター</Link> — 引越し費用の概算計算</li>
          <li><Link to="/tanshin">単身パック比較</Link> — 主要業者の単身パック比較</li>
          <li><Link to="/shoki-hiyo">初期費用トータル計算</Link> — 新生活の初期費用合計</li>
          <li><Link to="/fuyohin">不用品処分コスト計算</Link> — 不用品処分費用の計算</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="card__title">免責事項</h2>
        <ul style={{ fontSize: '0.85rem', lineHeight: 2, paddingLeft: '1.5rem', color: '#64748b' }}>
          <li>本サイトの計算結果はあくまで概算であり、実際の費用は引越し業者の見積もりにより異なります。</li>
          <li>特定の引越し業者を推奨するものではありません。</li>
          <li>オプション料金は業者により大きく異なる場合があります。</li>
          <li>不用品処分費用は自治体やメーカーにより異なります。掲載金額は一般的な目安です。</li>
          <li>本サイトの情報に基づいて行った判断・行動について、一切の責任を負いません。</li>
          <li>正確な費用を知りたい場合は、複数の引越し業者から見積もりを取ることをおすすめします。</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="card__title">運営者情報</h2>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: '#64748b' }}>
          お問い合わせ: <a href="mailto:tm.qp.sites@gmail.com">tm.qp.sites@gmail.com</a>
        </p>
      </div>

      <div className="card">
        <h2 className="card__title">広告について</h2>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: '#64748b' }}>
          本サイトでは、Google AdSenseによる広告配信を行っています。
          また、引越し一括見積もりサービスへのアフィリエイトリンクを掲載しています。
          これらのリンクを経由して申し込みが行われた場合、
          当サイトが紹介報酬を受け取ることがあります。
        </p>
      </div>
    </>
  );
}
