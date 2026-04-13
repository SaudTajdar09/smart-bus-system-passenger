import { useEffect, useState, useCallback } from 'react'
import { 
  getAllTickets, 
  saveTicketToStorage, 
  onTicketsChange,
  computeTicketStats 
} from '../utils/sharedTicketStorage.js'

/**
 * Hook for Passenger App to sync tickets with localStorage
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

  // Subscribe to ticket changes
  useEffect(() => {
    const unsubscribe = onTicketsChange((updatedTickets) => {
      setTickets(updatedTickets)
      setStats(computeTicketStats(updatedTickets))
      console.log('✅ Tickets synced from localStorage:', updatedTickets.length)
    })

    return unsubscribe
  }, [])

  // Add a new booked ticket
  const addBookedTicket = useCallback((ticketData) => {
    const ticket = {
      id: ticketData.id || `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'booked',
      createdAt: Date.now(),
      ...ticketData,
    }
    
    const saved = saveTicketToStorage(ticket)
    if (saved) {
      const updatedTickets = getAllTickets()
      setTickets(updatedTickets)
      setStats(computeTicketStats(updatedTickets))
      console.log('✅ Ticket booked and saved to localStorage:', ticket.id)
    }
    
    return saved
  }, [])

  return {
    tickets,
    stats,
    addBookedTicket,
    getAllTickets: () => getAllTickets(),
  }
}
