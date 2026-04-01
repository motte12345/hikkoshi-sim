import { useState, useCallback } from 'react';
import { tanshinPacks, fitsTanshinPack, getTanshinPrice } from '../data/tanshinPacks';
import { PREFECTURES, getPrefectureDistance, type Prefecture } from '../data/prefectureDistances';
import { calculateEstimate } from '../utils/calculateEstimate';
import { formatCurrency } from '../utils/formatCurrency';
import { CtaButton } from '../components/CtaButton';
import { Disclaimer } from '../components/Disclaimer';
import { Seo } from '../components/Seo';
import { AdSense } from '../components/AdSense';
import { trackCalculation } from '../utils/analytics';

type DistanceMode = 'direct' | 'prefecture';

export function TanshinPage() {
  const [boxCount, setBoxCount] = useState(15);
  const [hasLargeFurniture, setHasLargeFurniture] = useState(false);
  const [distanceMode, setDistanceMode] = useState<DistanceMode>('prefecture');
  const [distanceKm, setDistanceKm] = useState(50);
  const [prefFrom, setPrefFrom] = useState<Prefecture>('東京都');
  const [prefTo, setPrefTo] = useState<Prefecture>('東京都');
  const [showResult, setShowResult] = useState(false);
  const [boxError, setBoxError] = useState('');
  const [distanceError, setDistanceError] = useState('');

  const effectiveDistance = distanceMode === 'prefecture'
    ? getPrefectureDistance(prefFrom, prefTo)
    : distanceKm;

  const handleCalculate = useCallback(() => {
    let hasError = false;
    if (boxCount <= 0) {
      setBoxError('段ボール数は1箱以上を入力してください');
      hasError = true;
    } else {
      setBoxError('');
    }
    if (distanceMode === 'direct' && distanceKm <= 0) {
      setDistanceError('距離は1km以上を入力してください');
      hasError = true;
    } else {
      setDistanceError('');
    }
    if (hasError) return;
    setShowResult(true);
    trackCalculation('tanshin', { box_count: boxCount, distance_km: effectiveDistance });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [boxCount, distanceMode, distanceKm, effectiveDistance]);

  const results = tanshinPacks.map(pack => ({
    pack,
    fits: fitsTanshinPack(boxCount, hasLargeFurniture, pack),
    price: getTanshinPrice(pack, effectiveDistance),
  }));

  const anyFits = results.some(r => r.fits);

  // 通常プランの概算（単身パックに収まらない場合に表示）
  const normalEstimate = calculateEstimate({
    layout: '1R',
    volume: hasLargeFurniture ? '多め' : '普通',
    distanceKm: effectiveDistance,
    month: new Date().getMonth() + 1,
    dayType: '平日',
    timeSlot: 'フリー便',
    selectedOptionIds: [],
  });

  return (
    <>
      <Seo
        title="単身パック比較"
        description="荷物量と移動距離から主要引越し業者の単身パック料金を比較。パックに収まるかどうかも判定します。"
        path="/tanshin"
        faqItems={[
          { question: '単身パックに収まる荷物量はどれくらいですか？', answer: '一般的に段ボール15〜30箱程度です。大型家具（ベッド・ソファ等）がある場合は、対応プランを選ぶ必要があります。' },
          { question: '単身パックと通常プランはどちらが安いですか？', answer: '荷物が少なく段ボール20箱以内なら単身パックが安い場合が多いです。荷物が多い場合や大型家具がある場合は通常プランの方がお得になることもあります。' },
        ]}
      />
      <h1 className="page-title">単身パック比較</h1>
      <p className="page-description">
        荷物量と移動距離から、主要引越し業者の単身パック料金を比較します。
        パックに収まらない場合は通常プランの概算も表示します。
      </p>

      <div className="card">
        <h2 className="card__title">荷物量</h2>
        <div className={`form-group${boxError ? ' form-group--error' : ''}`}>
          <label htmlFor="boxes">段ボール数</label>
          <input
            id="boxes"
            type="number"
            min={1}
            max={100}
            value={boxCount}
            onChange={e => {
              setBoxCount(Number(e.target.value));
              setShowResult(false);
              if (Number(e.target.value) > 0) setBoxError('');
            }}
          />
          <p className="form-hint">段ボール（中サイズ）換算の個数を入力してください</p>
          {boxError && <p className="form-error-message">{boxError}</p>}
        </div>
        <div className="form-group">
          <label>大型家具の有無</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="no-large"
                name="largeFurniture"
                checked={!hasLargeFurniture}
                onChange={() => { setHasLargeFurniture(false); setShowResult(false); }}
              />
              <label htmlFor="no-large">なし</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="has-large"
                name="largeFurniture"
                checked={hasLargeFurniture}
                onChange={() => { setHasLargeFurniture(true); setShowResult(false); }}
              />
              <label htmlFor="has-large">あり（ベッド・ソファ等）</label>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card__title">移動距離</h2>
        <div className="distance-toggle">
          <button
            type="button"
            className={distanceMode === 'prefecture' ? 'active' : ''}
            onClick={() => { setDistanceMode('prefecture'); setDistanceError(''); }}
          >
            都道府県から計算
          </button>
          <button
            type="button"
            className={distanceMode === 'direct' ? 'active' : ''}
            onClick={() => { setDistanceMode('direct'); setDistanceError(''); }}
          >
            距離を直接入力
          </button>
        </div>

        {distanceMode === 'prefecture' ? (
          <div className="form-group">
            <div className="prefecture-row">
              <select value={prefFrom} onChange={e => { setPrefFrom(e.target.value as Prefecture); setShowResult(false); }}>
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="arrow">→</span>
              <select value={prefTo} onChange={e => { setPrefTo(e.target.value as Prefecture); setShowResult(false); }}>
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <p className="form-hint">概算距離: 約{effectiveDistance.toLocaleString()}km</p>
          </div>
        ) : (
          <div className={`form-group${distanceError ? ' form-group--error' : ''}`}>
            <label htmlFor="tanshin-distance">移動距離（km）</label>
            <input
              id="tanshin-distance"
              type="number"
              min={1}
              max={3000}
              value={distanceKm}
              onChange={e => {
                setDistanceKm(Number(e.target.value));
                setShowResult(false);
                if (Number(e.target.value) > 0) setDistanceError('');
              }}
            />
            {distanceError && <p className="form-error-message">{distanceError}</p>}
          </div>
        )}
      </div>

      {!showResult && (
        <div style={{ marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-primary" onClick={handleCalculate} style={{ width: '100%' }}>
            比較する
          </button>
        </div>
      )}

      {showResult && (
        <>
          <div className="card">
            <h2 className="card__title">単身パック比較結果</h2>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>業者・プラン</th>
                  <th>収まるか</th>
                  <th>概算費用</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ pack, fits, price }) => (
                  <tr key={`${pack.carrier}-${pack.planName}`}>
                    <td>
                      <strong>{pack.carrier}</strong><br />
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{pack.planName}</span>
                    </td>
                    <td style={{ color: fits ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      {fits ? '収まる' : '収まらない'}
                    </td>
                    <td>{fits ? formatCurrency(price) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="form-hint" style={{ marginTop: '0.75rem' }}>
              ※ 料金は目安です。実際の料金は各業者の見積もりをご確認ください。
            </p>
          </div>

          {!anyFits && (
            <div className="card">
              <h2 className="card__title">通常プランの概算</h2>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                お荷物が単身パックに収まらない可能性があります。通常プランの概算費用をご参考ください。
              </p>
              <div className="result-highlight">
                <div className="result-highlight__label">通常プラン概算</div>
                <div className="result-highlight__amount">
                  {formatCurrency(normalEstimate.totalMin)} 〜 {formatCurrency(normalEstimate.totalMax)}
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="card__title">単身パックと通常プランの違い</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '0.75rem' }}>
              単身パックは、複数の荷主の荷物を1台のトラックに混載して運ぶサービスです。トラックを1台丸ごと借り切る通常プランと異なり、スペースを他の荷主と共有するため、荷物が少ない単身引越しではコストを抑えられます。
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>単身パックのメリット</p>
            <ul style={{ fontSize: '0.9rem', lineHeight: 2, paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
              <li>荷物量が少ない場合に通常プランより安くなりやすい</li>
              <li>料金が明確で見積もり交渉が不要なケースが多い</li>
              <li>一人暮らしの引越しに特化したサービス設計</li>
            </ul>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>単身パックのデメリット</p>
            <ul style={{ fontSize: '0.9rem', lineHeight: 2, paddingLeft: '1.5rem' }}>
              <li>コンテナ（専用ボックス）に収まらない荷物は別途料金が発生する</li>
              <li>混載のため、配送に時間がかかる場合がある（即日配達が難しいことも）</li>
              <li>大型家具・家電がある場合は対応プランが限られる</li>
            </ul>
          </div>

          <CtaButton toolName="tanshin" />
          <AdSense slot="tanshin-result" />
          <Disclaimer />
        </>
      )}
    </>
  );
}
