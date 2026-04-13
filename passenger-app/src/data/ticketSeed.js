import { TICKETS } from './cityBusData.js'
import { addHours } from '../utils/ticketTime.js'

/** Default tickets for first load + localStorage seed shape */
export function buildInitialTickets() {
  return TICKETS.map((t, i) => {
    const bookedAt = i === 0 ? '2026-04-05T08:00:00.000Z' : '2026-04-04T06:00:00.000Z'
    return {
      id: t.id,
      route: t.route,
      from: t.from,
      to: t.to,
      seat: t.seat,
      seats: [t.seat],
      date: t.date,
      time: t.time,
      fare: t.fare,
      status: t.status,
      bookedAt,
      expiresAt: t.status === 'active' ? addHours(bookedAt, 3) : null,
      qrPayload: t.id, // QR code encodes the ticket ID
    }
  })
}
