import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LAYOUTS,
  VOLUMES,
  type LayoutType,
  type VolumeType,
  type DayType,
  type TimeSlot,
  defaultVolumeByLayout,
  seasonMultipliers,
  options as optionItems,
} from '../data/priceTable';
import { PREFECTURES, getPrefectureDistance, type Prefecture } from '../data/prefectureDistances';
import { calculateEstimate, type EstimateBreakdown } from '../utils/calculateEstimate';
import { formatCurrency } from '../utils/formatCurrency';
import { CtaButton } from '../components/CtaButton';
import { Disclaimer } from '../components/Disclaimer';
import { Seo } from '../components/Seo';
import { AdSense } from '../components/AdSense';
import { ProductLinks } from '../components/ProductLinks';
import { trackCalculation } from '../utils/analytics';
import { useSessionState } from '../hooks/useSessionState';

type DistanceMode = 'direct' | 'prefecture';

const STEP_LABELS = ['間取り・荷物', '距離', '時期・曜日', 'オプション'];

export function EstimatePage() {
  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(0);

  // Step 1
  const [layout, setLayout] = useSessionState<LayoutType>('est_layout', '1R');
  const [volume, setVolume] = useSessionState<VolumeType>('est_volume', '少なめ');

  // Validation errors
  const [distanceError, setDistanceError] = useState('');

  // Step 2
  const [distanceMode, setDistanceMode] = useSessionState<DistanceMode>('est_distMode', 'prefecture');
  const [distanceKm, setDistanceKm] = useSessionState('est_distKm', 50);
  const [prefFrom, setPrefFrom] = useSessionState<Prefecture>('est_prefFrom', '東京都');
  const [prefTo, setPrefTo] = useSessionState<Prefecture>('est_prefTo', '東京都');

  // Step 3
  const [month, setMonth] = useSessionState('est_month', new Date().getMonth() + 1);
  const [dayType, setDayType] = useSessionState<DayType>('est_dayType', '平日');
  const [timeSlot, setTimeSlot] = useSessionState<TimeSlot>('est_timeSlot', 'フリー便');

  // Step 4
  const [selectedOptions, setSelectedOptions] = useSessionState<string[]>('est_options', []);

  // Result
  const [result, setResult] = useState<EstimateBreakdown | null>(null);

  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
    setVolume(defaultVolumeByLayout[newLayout]);
  }, [setLayout, setVolume]);

  const toggleOption = useCallback((id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  }, [setSelectedOptions]);

  const effectiveDistance = distanceMode === 'prefecture'
    ? getPrefectureDistance(prefFrom, prefTo)
    : distanceKm;

  const handleCalculate = useCallback(() => {
    const breakdown = calculateEstimate({
      layout,
      volume,
      distanceKm: effectiveDistance,
      month,
      dayType,
      timeSlot,
      selectedOptionIds: selectedOptions,
    });
    setResult(breakdown);
    trackCalculation('estimate', { layout, month: String(month), distance_km: effectiveDistance });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [layout, volume, effectiveDistance, month, dayType, timeSlot, selectedOptions]);

  const goNext = useCallback(() => {
    // Step 1 (距離入力) のバリデーション
    if (step === 1 && distanceMode === 'direct' && distanceKm <= 0) {
      setDistanceError('距離は1km以上を入力してください');
      return;
    }
    setDistanceError('');
    setStepKey(k => k + 1);
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      handleCalculate();
    }
  }, [step, distanceMode, distanceKm, handleCalculate]);

  const goPrev = useCallback(() => {
    if (step > 0) {
      setDistanceError('');
      setStepKey(k => k + 1);
      setStep(s => s - 1);
    }
  }, [step]);

  return (
    <>
      <Seo
        title="引越し費用の計算"
        description="間取り・移動距離・時期・オプションから引越し費用の概算を計算。繁忙期・曜日・時間帯による料金差を明示します。"
        path="/estimate"
        faqItems={[
          { question: '引越し費用はどうやって計算されますか？', answer: '基本料金（間取り×荷物量）に距離加算を加え、時期・曜日・時間帯の係数を掛けて算出します。オプション料金は別途加算されます。結果は±15%のレンジで表示します。' },
          { question: 'フリー便とは何ですか？', answer: 'フリー便は引越し業者の都合に合わせて時間を決める便です。午前便や午後便より15%程度安くなります。' },
        ]}
      />
      <h1 className="page-title">引越し費用シミュレーター</h1>
      <p className="page-description">
        間取り・移動距離・時期から引越し費用の概算を計算します。
        ステップに沿って入力してください。
      </p>

      {!result && (
        <div className="card">
          <div className="steps">
            {STEP_LABELS.map((label, i) => (
              <button
                key={label}
                className={`step-indicator ${i === step ? 'step-indicator--active' : ''} ${i < step ? 'step-indicator--done' : ''}`}
                onClick={() => { if (i <= step) setStep(i); }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {step === 0 && (
            <div key={stepKey} className="step-content">
              <div className="form-group">
                <label htmlFor="layout">間取り</label>
                <select
                  id="layout"
                  value={layout}
                  onChange={e => handleLayoutChange(e.target.value as LayoutType)}
                >
                  {LAYOUTS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>荷物量</label>
                <div className="radio-group">
                  {VOLUMES.map(v => (
                    <div key={v} className="radio-option">
                      <input
                        type="radio"
                        id={`vol-${v}`}
                        name="volume"
                        value={v}
                        checked={volume === v}
                        onChange={() => setVolume(v)}
                      />
                      <label htmlFor={`vol-${v}`}>{v}</label>
                    </div>
                  ))}
                </div>
                <p className="form-hint">間取りに応じたデフォルト値が自動設定されます</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div key={stepKey} className="step-content">
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
                  <label>出発地 → 到着地</label>
                  <div className="prefecture-row">
                    <select
                      value={prefFrom}
                      onChange={e => setPrefFrom(e.target.value as Prefecture)}
                    >
                      {PREFECTURES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <span className="arrow">→</span>
                    <select
                      value={prefTo}
                      onChange={e => setPrefTo(e.target.value as Prefecture)}
                    >
                      {PREFECTURES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <p className="form-hint">
                    概算距離: 約{effectiveDistance.toLocaleString()}km
                    （都道府県庁所在地間の道路距離概算）
                  </p>
                </div>
              ) : (
                <div className={`form-group${distanceError ? ' form-group--error' : ''}`}>
                  <label htmlFor="distance">移動距離（km）</label>
                  <input
                    id="distance"
                    type="number"
                    min={1}
                    max={3000}
                    value={distanceKm}
                    onChange={e => {
                      setDistanceKm(Number(e.target.value));
                      if (Number(e.target.value) > 0) setDistanceError('');
                    }}
                  />
                  {distanceError && (
                    <p className="form-error-message">{distanceError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div key={stepKey} className="step-content">
              <div className="form-group">
                <label htmlFor="month">引越し月</label>
                <select
                  id="month"
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>
                      {m}月（{seasonMultipliers[m].label}）
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>曜日</label>
                <div className="radio-group">
                  {(['平日', '土日祝'] as const).map(d => (
                    <div key={d} className="radio-option">
                      <input
                        type="radio"
                        id={`day-${d}`}
                        name="dayType"
                        value={d}
                        checked={dayType === d}
                        onChange={() => setDayType(d)}
                      />
                      <label htmlFor={`day-${d}`}>{d}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>時間帯</label>
                <div className="radio-group">
                  {(['午前便', '午後便', 'フリー便'] as const).map(t => (
                    <div key={t} className="radio-option">
                      <input
                        type="radio"
                        id={`time-${t}`}
                        name="timeSlot"
                        value={t}
                        checked={timeSlot === t}
                        onChange={() => setTimeSlot(t)}
                      />
                      <label htmlFor={`time-${t}`}>{t}</label>
                    </div>
                  ))}
                </div>
                <p className="form-hint">フリー便が最もお得です（業者の都合に合わせるため）</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div key={stepKey} className="step-content">
              <div className="form-group">
                <label>オプション（該当するものにチェック）</label>
                <div className="checkbox-group">
                  {optionItems.map(opt => (
                    <label key={opt.id} className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(opt.id)}
                        onChange={() => toggleOption(opt.id)}
                      />
                      <div className="checkbox-option__info">
                        <div className="checkbox-option__name">{opt.name}</div>
                        <div className="checkbox-option__price">
                          {formatCurrency(opt.price)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="btn-group">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={goPrev}>
                戻る
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={goNext} style={{ flex: 1 }}>
              {step < 3 ? '次へ' : '計算する'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <>
          <div className="result-highlight">
            <div className="result-highlight__label">引越し費用の概算</div>
            <div className="result-highlight__amount">
              {formatCurrency(result.totalMin)} 〜 {formatCurrency(result.totalMax)}
            </div>
          </div>

          <div className="card">
            <h2 className="card__title">費用の内訳</h2>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>金額・係数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>基本料金（{layout}・{volume}）</td>
                  <td>{formatCurrency(result.basePrice)}</td>
                </tr>
                <tr>
                  <td>距離加算（{result.distanceLabel}）</td>
                  <td>{result.distanceSurcharge > 0 ? `+${formatCurrency(result.distanceSurcharge)}` : '加算なし'}</td>
                </tr>
                <tr>
                  <td>時期（{result.seasonLabel}）</td>
                  <td>×{result.seasonMultiplier}</td>
                </tr>
                <tr>
                  <td>曜日（{result.dayLabel}）</td>
                  <td>×{result.dayMultiplier}</td>
                </tr>
                <tr>
                  <td>時間帯（{result.timeLabel}）</td>
                  <td>×{result.timeMultiplier}</td>
                </tr>
                {result.optionsDetail.map(opt => (
                  <tr key={opt.name}>
                    <td>{opt.name}</td>
                    <td>+{formatCurrency(opt.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>概算費用</td>
                  <td>{formatCurrency(result.totalMin)} 〜 {formatCurrency(result.totalMax)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link
              to={`/shoki-hiyo?moving-cost=${Math.round((result.totalMin + result.totalMax) / 2)}`}
              className="btn btn-secondary"
              style={{ display: 'inline-flex' }}
            >
              この結果を初期費用計算に反映する
            </Link>
          </div>

          <CtaButton toolName="estimate" />

          <AdSense slot="estimate-result" />

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setResult(null); setStep(0); }}
            >
              もう一度計算する
            </button>
          </div>

          <div className="card">
            <h2 className="card__title">引越し費用を安くするコツ</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '0.75rem' }}>
              同じ条件でも、時期や業者の選び方次第で費用は大きく変わります。以下のポイントを押さえることで、数万円単位の節約につながることがあります。
            </p>
            <ul style={{ fontSize: '0.9rem', lineHeight: 2, paddingLeft: '1.5rem' }}>
              <li><strong>閑散期（5〜11月）を狙う</strong> — 需要が少なく業者も値引きに応じやすい時期です。</li>
              <li><strong>平日・フリー便を選ぶ</strong> — 土日祝や午前便と比べて10〜20%ほど安くなるケースがあります。</li>
              <li><strong>荷物を減らす</strong> — 不用品は事前にフリマアプリやリサイクルショップで処分しておくと、搬出作業が減り基本料金が下がります。</li>
              <li><strong>複数業者から見積もりを取る</strong> — 一括見積もりサービスを使うと、複数業者の料金を一度に比較できます。</li>
              <li><strong>早めの予約で割引を受ける</strong> — 引越し日の1〜2ヶ月前に予約することで、早割が適用される業者もあります。</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="card__title">3月の引越しはなぜ高い？</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
              3月は新年度に向けた転勤・入学・就職が集中するシーズンです。この時期は引越し需要が一気に高まり、業者の作業員やトラックが慢性的に不足します。需給バランスが崩れることで料金が上がり、<strong>通常期の1.3〜1.5倍</strong>になることも珍しくありません。
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginTop: '0.75rem' }}>
              3月の中でも特に高いのは月末（26〜31日）で、引越し件数が集中します。3月上旬はまだ比較的空きがあり料金も抑えられる傾向があります。もし日程をずらせるなら、4月上旬まで待つのも一つの選択肢です。4月に入ると需要が落ち着き始め、料金も下がっていきます。
            </p>
          </div>

          <ProductLinks />

          <Disclaimer />
        </>
      )}
    </>
  );
}
