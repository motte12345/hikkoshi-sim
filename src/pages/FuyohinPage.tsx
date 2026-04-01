import { useState, useMemo } from 'react';
import { disposalItems, type DisposalItem } from '../data/disposalCosts';
import { formatCurrency } from '../utils/formatCurrency';
import { Disclaimer } from '../components/Disclaimer';
import { Seo } from '../components/Seo';
import { AdSense } from '../components/AdSense';
import { trackCalculation } from '../utils/analytics';

export function FuyohinPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setShowResult(false);
  };

  const selectedItems = useMemo(
    () => disposalItems.filter(item => selectedIds.includes(item.id)),
    [selectedIds]
  );

  const totals = useMemo(() => {
    const municipalTotal = selectedItems.reduce(
      (sum, item) => sum + item.municipalCost, 0
    );
    const recycleTotal = selectedItems.reduce(
      (sum, item) => sum + item.recycleFee + item.collectionFee, 0
    );
    const disposalTotal = municipalTotal + recycleTotal;
    const buybackTotal = selectedItems.reduce(
      (sum, item) => sum + item.buybackEstimate, 0
    );
    return { municipalTotal, recycleTotal, disposalTotal, buybackTotal };
  }, [selectedItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, DisposalItem[]> = {};
    for (const item of disposalItems) {
      const cat = item.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, []);

  return (
    <>
      <Seo
        title="不用品処分コスト計算"
        description="引越しで不要になった家電・家具の処分費用を品目ごとに計算。リサイクル料・粗大ゴミ費用・買取見積もりを比較できます。"
        path="/fuyohin"
        faqItems={[
          { question: 'リサイクル家電の処分方法は？', answer: '冷蔵庫・洗濯機・テレビ・エアコンは家電リサイクル法の対象で、自治体の粗大ゴミとしては回収できません。指定引取場所への持ち込みか、購入店・引越し業者への引き取り依頼が必要です。' },
          { question: '不用品は売った方がお得ですか？', answer: '状態の良い家電・家具はリサイクルショップやフリマアプリで売ることで、処分費用を節約できるだけでなく収入にもなります。ただし買取価格は状態や需要により大きく変動します。' },
        ]}
      />
      <h1 className="page-title">不用品処分コスト計算</h1>
      <p className="page-description">
        引越しで処分したい品目を選択してください。
        自治体の粗大ゴミ費用、リサイクル料、買取見積もりを比較できます。
      </p>

      <div className="card">
        <h2 className="card__title">処分する品目を選択</h2>
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
              {category}
            </h3>
            <div className="checkbox-group">
              {items.map(item => (
                <label key={item.id} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <div className="checkbox-option__info">
                    <div className="checkbox-option__name">{item.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        {!showResult && selectedIds.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => { setShowResult(true); trackCalculation('fuyohin', { item_count: selectedIds.length }); }}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            処分費用を計算する
          </button>
        )}
      </div>

      {showResult && selectedItems.length > 0 && (
        <>
          <div className="result-highlight">
            <div className="result-highlight__label">処分費用の合計（目安）</div>
            <div className="result-highlight__amount">
              {formatCurrency(totals.disposalTotal)}
            </div>
            {totals.buybackTotal > 0 && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                買取に出した場合の見積もり: 約{formatCurrency(totals.buybackTotal)}
                （差額: 約{formatCurrency(totals.disposalTotal - totals.buybackTotal)}の節約可能性）
              </p>
            )}
          </div>

          <div className="card">
            <h2 className="card__title">品目ごとの費用内訳</h2>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>品目</th>
                  <th>処分費用</th>
                  <th>買取見積もり</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(item => {
                  const disposalCost = item.category === 'リサイクル家電'
                    ? item.recycleFee + item.collectionFee
                    : item.municipalCost;
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.name}
                        {item.category === 'リサイクル家電' && (
                          <br />
                        )}
                        {item.category === 'リサイクル家電' && (
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            リサイクル料{formatCurrency(item.recycleFee)} + 収集運搬料{formatCurrency(item.collectionFee)}
                          </span>
                        )}
                      </td>
                      <td>{formatCurrency(disposalCost)}</td>
                      <td style={{ color: item.buybackEstimate > 0 ? '#16a34a' : '#64748b' }}>
                        {item.buybackEstimate > 0 ? formatCurrency(item.buybackEstimate) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td>合計</td>
                  <td>{formatCurrency(totals.disposalTotal)}</td>
                  <td style={{ color: '#16a34a' }}>{formatCurrency(totals.buybackTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="card">
            <h2 className="card__title">リサイクル家電について</h2>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
              冷蔵庫・洗濯機・テレビ・エアコンは<strong>家電リサイクル法</strong>の対象品目です。
              自治体の粗大ゴミとしては回収できず、指定引取場所への持ち込みか、
              購入店・引越し業者への引き取り依頼が必要です。
              リサイクル料金はメーカーにより異なる場合があります。
            </p>
          </div>

          <AdSense slot="fuyohin-result" />
          <Disclaimer />
        </>
      )}
    </>
  );
}
