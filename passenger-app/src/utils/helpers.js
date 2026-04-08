export function formatTime(isoOrDate) {
  if (!isoOrDate) return '—'
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
}

export function formatInr(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return `₹${Number(amount).toLocaleString('en-IN')}`
}
