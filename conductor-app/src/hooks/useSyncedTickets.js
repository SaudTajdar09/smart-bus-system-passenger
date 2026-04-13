import { useEffect, useState, useCallback } from 'react'
import { 
  getAllTickets, 
  updateTicketStatus,
  onTicketsChange,
  computeTicketStats 
} from '../utils/sharedTicketStorage.js'

/**
 * Hook for Conductor App to sync tickets with localStorage
 */
export function useSyncedTickets() {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({
    totalTickets: 0,
    bookedTickets: 0,
    boardedTickets: 0,
    totalRevenue: 0,
    totalPassengers: 0,
  })

  // Load initial tickets on mount
  useEffect(() => {
    const initialTickets = getAllTickets()
    setTickets(initialTickets)
    setStats(computeTicketStats(initialTickets))
  }, [])

  // Subscribe to ticket changes from other apps/tabs
  useEffect(() => {
    const unsubscribe = onTicketsChange((updatedTickets) => {
      setTickets(updatedTickets)
      setStats(computeTicketStats(updatedTickets))
      console.log('✅ Tickets synced from Passenger App:', updatedTickets.length)
    })

    return unsubscribe
  }, [])

  // Board a passenger (update ticket status to boarded)
  const boardPassenger = useCallback((ticketId) => {
    const updated = updateTicketStatus(ticketId, 'boarded')
    if (updated) {
      const allTickets = getAllTickets()
      setTickets(allTickets)
      setStats(computeTicketStats(allTickets))
      console.log('✅ Passenger boarded:', ticketId)
    }
    return updated
  }, [])

  // Get tickets for current route
  const getTicketsForRoute = useCallback((route) => {
    return tickets.filter(t => t.route === route)
  }, [tickets])

  return {
    tickets,
    stats,
    boardPassenger,
    getTicketsForRoute,
    getAllTickets: () => getAllTickets(),
  }
}
