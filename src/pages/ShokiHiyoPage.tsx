import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { CtaButton } from '../components/CtaButton';
import { Disclaimer } from '../components/Disclaimer';
import { Seo } from '../components/Seo';
import { AdSense } from '../components/AdSense';
import { trackCalculation } from '../utils/analytics';

export function ShokiHiyoPage() {
  const [searchParams] = useSearchParams();
  const [rent, setRent] = useState(80000);
  const [shikikin, setShikikin] = useState(1);
  const [reikin, setReikin] = useState(1);
  const [chukai, setChukai] = useState(1);
  const [insurance, setInsurance] = useState(15000);
  const [keyChange, setKeyChange] = useState(15000);
  const [movingCost, setMovingCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);

  const [rentError, setRentError] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const paramCost = searchParams.get('moving-cost');
    if (paramCost !== null) {
      const parsed = Number(paramCost);
      if (!isNaN(parsed) && parsed > 0) {
        setMovingCost(parsed);
      }
    }
  }, [searchParams]);

  const breakdown = useMemo(() => {
    const shikikinAmount = rent * shikikin;
    const reikinAmount = rent * reikin;
    const chukaiAmount = rent * chukai;
    const firstMonth = rent;

    const items = [
      { label: `家賃（初月分）`, amount: firstMonth },
      { label: `敷金（${shikikin}ヶ月分）`, amount: shikikinAmount },
      { label: `礼金（${reikin}ヶ月分）`, amount: reikinAmount },
      { label: `仲介手数料（${chukai}ヶ月分）`, amount: chukaiAmount },
      { label: '火災保険料', amount: insurance },
      { label: '鍵交換費用', amount: keyChange },
      { label: '引越し費用', amount: movingCost },
      { label: 'その他', amount: otherCost },
    ];

    const total = items.reduce((sum, item) => sum + item.amount, 0);
    return { items, total };
  }, [rent, shikikin, reikin, chukai, insurance, keyChange, movingCost, otherCost]);

  return (
    <>
      <Seo
        title="引越し初期費用トータル計算"
        description="敷金・礼金・仲介手数料・火災保険・引越し費用など、新生活に必要な初期費用の合計を算出します。"
        path="/shoki-hiyo"
        faqItems={[
          { question: '引越しの初期費用は家賃の何ヶ月分ですか？', answer: '一般的に家賃の4〜6ヶ月分が目安です。敷金・礼金各1ヶ月、仲介手数料1ヶ月、初月家賃、火災保険、鍵交換費用、引越し費用を含みます。' },
        ]}
      />
      <h1 className="page-title">引越し初期費用トータル計算</h1>
      <p className="page-description">
        新生活を始めるために必要な初期費用の合計を算出します。
        引越し費用だけでなく、敷金・礼金・仲介手数料なども含めた総額を把握しましょう。
      </p>

      <div className="card">
        <h2 className="card__title">新居の情報</h2>

        <div className={`form-group${rentError ? ' form-group--error' : ''}`}>
          <label htmlFor="rent">月額家賃（円）</label>
          <input
            id="rent"
            type="number"
            min={1}
            step={1000}
            value={rent}
            onChange={e => {
              setRent(Number(e.target.value));
              setShowResult(false);
              if (Number(e.target.value) > 0) setRentError('');
            }}
          />
          {rentError && <p className="form-error-message">{rentError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="shikikin">敷金（月数）</label>
          <select
            id="shikikin"
            value={shikikin}
            onChange={e => { setShikikin(Number(e.target.value)); setShowResult(false); }}
          >
            {[0, 0.5, 1, 1.5, 2, 3].map(n => (
              <option key={n} value={n}>{n}ヶ月</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reikin">礼金（月数）</label>
          <select
            id="reikin"
            value={reikin}
            onChange={e => { setReikin(Number(e.target.value)); setShowResult(false); }}
          >
            {[0, 0.5, 1, 1.5, 2].map(n => (
              <option key={n} value={n}>{n}ヶ月</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="chukai">仲介手数料（月数）</label>
          <select
            id="chukai"
            value={chukai}
            onChange={e => { setChukai(Number(e.target.value)); setShowResult(false); }}
          >
            {[0, 0.5, 1].map(n => (
              <option key={n} value={n}>{n}ヶ月</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="insurance">火災保険料（円）</label>
          <input
            id="insurance"
            type="number"
            min={0}
            step={1000}
            value={insurance}
            onChange={e => { setInsurance(Number(e.target.value)); setShowResult(false); }}
          />
          <p className="form-hint">一般的には10,000〜20,000円程度</p>
        </div>

        <div className="form-group">
          <label htmlFor="keyChange">鍵交換費用（円）</label>
          <input
            id="keyChange"
            type="number"
            min={0}
            step={1000}
            value={keyChange}
            onChange={e => { setKeyChange(Number(e.target.value)); setShowResult(false); }}
          />
          <p className="form-hint">一般的には10,000〜20,000円程度</p>
        </div>

        <div className="form-group">
          <label htmlFor="movingCost">引越し費用（円）</label>
          <input
            id="movingCost"
            type="number"
            min={0}
            step={1000}
            value={movingCost}
            onChange={e => { setMovingCost(Number(e.target.value)); setShowResult(false); }}
          />
          <p className="form-hint">
            <a href="/estimate">引越し費用シミュレーター</a>で計算した結果を入力できます
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="otherCost">その他の費用（円）</label>
          <input
            id="otherCost"
            type="number"
            min={0}
            step={1000}
            value={otherCost}
            onChange={e => { setOtherCost(Number(e.target.value)); setShowResult(false); }}
          />
          <p className="form-hint">保証会社への保証料、消毒費用など</p>
        </div>

        {!showResult && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (rent <= 0) {
                setRentError('家賃は1円以上を入力してください');
                return;
              }
              setRentError('');
              setShowResult(true);
              trackCalculation('shoki-hiyo', { rent });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            合計を計算する
          </button>
        )}
      </div>

      {showResult && (
        <>
          <div className="result-highlight">
            <div className="result-highlight__label">初期費用の合計</div>
            <div className="result-highlight__amount">
              {formatCurrency(breakdown.total)}
            </div>
          </div>

          <div className="card">
            <h2 className="card__title">内訳</h2>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>金額</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.items
                  .filter(item => item.amount > 0)
                  .map(item => (
                    <tr key={item.label}>
                      <td>{item.label}</td>
                      <td>{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>合計</td>
                  <td>{formatCurrency(breakdown.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="card">
            <h2 className="card__title">家賃に対する初期費用の目安</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              一般的に、引越しの初期費用は<strong>家賃の4〜6ヶ月分</strong>が目安と言われています。
              あなたの場合は<strong>家賃の約{rent > 0 ? (breakdown.total / rent).toFixed(1) : '—'}ヶ月分</strong>です。
            </p>
          </div>

          <CtaButton label="引越し費用をもっと安くする（無料見積もり）" toolName="shoki-hiyo" />
          <AdSense slot="shoki-hiyo-result" />
          <Disclaimer />
        </>
      )}
    </>
  );
}
