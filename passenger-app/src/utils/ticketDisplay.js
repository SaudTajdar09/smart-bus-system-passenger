export function ticketSeatsList(t) {
  if (Array.isArray(t.seats) && t.seats.length) return t.seats
  if (t.seat) return [t.seat]
  return []
}

export function passengerSeatSummary(t) {
  const list = ticketSeatsList(t)
  const count = list.length
  const seatsText = list.join(', ')
  const line =
    count === 0
      ? '—'
      : count === 1
        ? `1 passenger · Seat ${list[0]}`
        : `${count} passengers · Seats ${seatsText}`
  return { count, list, seatsText, line }
}
