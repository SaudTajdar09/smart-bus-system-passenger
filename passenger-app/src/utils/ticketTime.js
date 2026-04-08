export function formatBookingDate(date) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatBookingTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function addHours(isoOrDate, hours) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  return new Date(d.getTime() + hours * 60 * 60 * 1000).toISOString()
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${formatBookingDate(d)} · ${formatBookingTime(d)}`
}

export function expiryRemainingText(expiresAt, now = new Date()) {
  if (!expiresAt) return 'Ticket expires in 3 hours'
  const end = new Date(expiresAt)
  if (Number.isNaN(end.getTime())) return 'Ticket expires in 3 hours'

  const diffMs = end.getTime() - now.getTime()
  if (diffMs <= 0) return 'Ticket expired'

  const totalMin = Math.ceil(diffMs / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h <= 0) return `Ticket expires in ${m}m`
  if (m === 0) return `Ticket expires in ${h}h`
  return `Ticket expires in ${h}h ${m}m`
}
