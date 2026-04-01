export function formatCurrency(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return '—円';
  return amount.toLocaleString('ja-JP') + '円';
}
