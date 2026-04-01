import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { AdSense } from '../components/AdSense';

const tools = [
  {
    path: '/estimate',
    icon: '🚛',
    title: '引越し費用シミュレーター',
    desc: '間取り・移動距離・時期・オプションから引越し費用の概算を計算。繁忙期・曜日・時間帯による料金差も確認できます。',
  },
  {
    path: '/tanshin',
    icon: '📦',
    title: '単身パック比較',
    desc: '荷物量と移動距離から、主要業者の単身パック料金を比較。パックに収まるかどうかも判定します。',
  },
  {
    path: '/shoki-hiyo',
    icon: '🏠',
    title: '引越し初期費用トータル計算',
    desc: '敷金・礼金・仲介手数料・引越し費用など、新生活に必要な初期費用の合計を算出します。',
  },
  {
    path: '/fuyohin',
    icon: '♻️',
    title: '不用品処分コスト計算',
    desc: '不用品の処分にかかる費用を品目ごとに計算。リサイクル料・粗大ゴミ費用・買取見積もりを比較できます。',
  },
] as const;

const FAQ_ITEMS = [
  {
    question: '引越し費用の相場はどれくらいですか？',
    answer: '単身（1R〜1K）の場合、通常期で25,000〜45,000円、繁忙期（3〜4月）で40,000〜70,000円が目安です。ファミリー（3LDK〜）の場合は通常期で80,000〜150,000円程度です。距離や荷物量により変動します。',
  },
  {
    question: '引越しの繁忙期はいつですか？',
    answer: '3月〜4月が最も繁忙期で、通常期の1.3〜1.5倍の料金になることがあります。2月や12月もやや高めです。5月〜11月の平日が最もお得に引越しできる時期です。',
  },
  {
    question: '引越し費用を安くする方法は？',
    answer: '閑散期（5〜11月）の平日にフリー便を選ぶのが最も効果的です。また、荷物を減らす、複数業者から見積もりを取る、早めに予約するなどの方法があります。',
  },
];

export function HomePage() {
  return (
    <>
      <Seo
        title="引越し費用シミュレーター"
        description="引越し費用の概算をステップ形式で簡単にシミュレーション。繁忙期・曜日・時間帯による料金差も明示。単身パック比較、初期費用計算、不用品処分コスト計算も。"
        path="/"
        faqItems={FAQ_ITEMS}
      />

      <h1 className="page-title">引越し費用シミュレーター</h1>
      <p className="page-description">
        引越しにかかる費用を、さまざまな角度からシミュレーションできます。
        目的に合ったツールを選んでください。
      </p>

      <div className="tool-grid">
        {tools.map(tool => (
          <Link key={tool.path} to={tool.path} className="tool-card">
            <div className="tool-card__icon" aria-hidden="true">{tool.icon}</div>
            <div className="tool-card__title">{tool.title}</div>
            <div className="tool-card__desc">{tool.desc}</div>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="card__title">引越し費用の相場</h2>
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>間取り</th>
              <th>通常期の目安</th>
              <th>繁忙期（3〜4月）の目安</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1R〜1K（単身）</td><td>25,000〜45,000円</td><td>40,000〜70,000円</td></tr>
            <tr><td>1LDK〜2DK</td><td>45,000〜80,000円</td><td>65,000〜120,000円</td></tr>
            <tr><td>2LDK〜3DK</td><td>65,000〜110,000円</td><td>95,000〜165,000円</td></tr>
            <tr><td>3LDK〜4LDK</td><td>80,000〜150,000円</td><td>120,000〜220,000円</td></tr>
          </tbody>
        </table>
        <p className="form-hint" style={{ marginTop: '0.75rem' }}>
          ※ 上記は近距離（同一都道府県内）の目安です。長距離の場合は距離加算が発生します。
        </p>
      </div>

      <AdSense slot="home-bottom" />
    </>
  );
}
