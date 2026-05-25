export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// show 6 decimal places for rates so small currencies don't round to zero
export function formatRate(rate) {
  if (!rate) return '—';
  return Number(rate).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', { dateStyle: 'medium' });
}
