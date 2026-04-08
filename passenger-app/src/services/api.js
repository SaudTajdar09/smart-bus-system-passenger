const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getRoutes: () => request('/routes'),
  getTickets: () => request('/tickets'),
  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
}
