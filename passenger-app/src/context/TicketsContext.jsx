import { useCallback, useMemo } from 'react'
import { TicketsContext } from './tickets-context.js'
import { useLocalState } from '../hooks/useLocalState.js'
import { buildInitialTickets } from '../data/ticketSeed.js'
import { addHours } from '../utils/ticketTime.js'

export function TicketsProvider({ children }) {
  const [tickets, setTickets] = useLocalState('citybus-passenger-tickets', buildInitialTickets())

  const addBookingTicket = useCallback(
    (payload) => {
      setTickets((prev) => {
        const demoted = prev.map((t) => (t.status === 'active' ? { ...t, status: 'used' } : t))
        const bookedAt = payload.bookedAt ?? new Date().toISOString()
        const expiresAt = payload.expiresAt ?? addHours(bookedAt, 3)

        const newTicket = {
          id: payload.id,
          route: payload.routeId,
          from: payload.from,
          to: payload.to,
          seats: [...payload.seats],
          seat: payload.seats[0] ?? '�',
          date: payload.date,
          time: payload.time,
          fare: payload.fare,
          status: 'active',
          bookedAt,
          expiresAt,
          qrPayload: payload.id, // QR code encodes the ticket ID
        }
        return [newTicket, ...demoted]
      })
    },
    [setTickets],
  )

  const value = useMemo(() => ({ tickets, addBookingTicket }), [tickets, addBookingTicket])

  return <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
}
