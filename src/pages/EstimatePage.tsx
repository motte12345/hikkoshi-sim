import { useState, useCallback } from 'react';
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
import { trackCalculation } from '../utils/analytics';

type DistanceMode = 'direct' | 'prefecture';

const STEP_LABELS = ['間取り・荷物', '距離', '時期・曜日', 'オプション'];

export function EstimatePage() {
  const [step, setStep] = useState(0);

  // Step 1
  const [layout, setLayout] = useState<LayoutType>('1R');
  const [volume, setVolume] = useState<VolumeType>('少なめ');

  // Step 2
  const [distanceMode, setDistanceMode] = useState<DistanceMode>('prefecture');
  const [distanceKm, setDistanceKm] = useState(50);
  const [prefFrom, setPrefFrom] = useState<Prefecture>('東京都');
  const [prefTo, setPrefTo] = useState<Prefecture>('東京都');

  // Step 3
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dayType, setDayType] = useState<DayType>('平日');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('フリー便');

  // Step 4
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Result
  const [result, setResult] = useState<EstimateBreakdown | null>(null);

  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
    setVolume(defaultVolumeByLayout[newLayout]);
  }, []);

  const toggleOption = useCallback((id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  }, []);

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
  }, [layout, volume, effectiveDistance, month, dayType, timeSlot, selectedOptions]);

  const goNext = useCallback(() => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      handleCalculate();
    }
  }, [step, handleCalculate]);

  const goPrev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  return (
    <>
      <Seo
        title="引越し費用シミュレーター"
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
                onClick={() => setStep(i)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {step === 0 && (
            <>
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
            </>
          )}

          {step === 1 && (
            <>
              <div className="distance-toggle">
                <button
                  type="button"
                  className={distanceMode === 'prefecture' ? 'active' : ''}
                  onClick={() => setDistanceMode('prefecture')}
                >
                  都道府県から計算
                </button>
                <button
                  type="button"
                  className={distanceMode === 'direct' ? 'active' : ''}
                  onClick={() => setDistanceMode('direct')}
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
                <div className="form-group">
                  <label htmlFor="distance">移動距離（km）</label>
                  <input
                    id="distance"
                    type="number"
                    min={0}
                    max={3000}
                    value={distanceKm}
                    onChange={e => setDistanceKm(Number(e.target.value))}
                  />
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
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
            </>
          )}

          {step === 3 && (
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

          <Disclaimer />
        </>
      )}
    </>
  );
}
