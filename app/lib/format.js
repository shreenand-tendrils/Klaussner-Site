export function formatMoney(m) {
  if (!m) return '';
  return new Intl.NumberFormat('en-US', {style: 'currency', currency: m.currencyCode, maximumFractionDigits: 0}).format(parseFloat(m.amount));
}