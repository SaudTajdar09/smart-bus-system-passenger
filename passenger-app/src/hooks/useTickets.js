import { useContext, useMemo } from 'react'
import { TicketsContext } from '../context/tickets-context.js'

export function useTickets() {
  const ctx = useContext(TicketsContext)
  if (!ctx) throw new Error('useTickets must be used within TicketsProvider')
  return ctx
}

/** Active ticket(s) and history sorted newest first */
export function useTicketsPartitioned() {
  const { tickets, addBookingTicket } = useTickets()

  return useMemo(() => {
    const active = tickets.filter((t) => t.status === 'active')
    const history = tickets
      .filter((t) => t.status === 'used')
      .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    const activeSeatIds = new Set(
      active.flatMap((t) => (Array.isArray(t.seats) && t.seats.length ? t.seats : t.seat ? [t.seat] : [])),
    )
    return { active, history, addBookingTicket, activeSeatIds }
  }, [tickets, addBookingTicket])
}
