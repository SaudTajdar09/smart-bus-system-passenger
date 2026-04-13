import { useEffect, useState } from 'react'
import { 
  getAllTickets, 
  onTicketsChange,
  computeTicketStats 
} from '../utils/sharedTicketStorage.js'

/**
 * Hook for Depot Admin App to read tickets and compute statistics
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
    console.log('✅ Depot loaded initial tickets:', initialTickets.length)
  }, [])

  // Subscribe to real-time ticket changes from Passenger/Conductor apps
  useEffect(() => {
    const unsubscribe = onTicketsChange((updatedTickets) => {
      setTickets(updatedTickets)
      const newStats = computeTicketStats(updatedTickets)
      setStats(newStats)
      console.log('✅ Depot dashboard updated - Boarded:', newStats.boardedTickets, 'Revenue: ₹', newStats.totalRevenue)
    })

    return unsubscribe
  }, [])

  // Get revenue by route
  const getRevenueByRoute = () => {
    const byRoute = {}
    tickets.forEach(t => {
      if (!byRoute[t.route]) byRoute[t.route] = 0
      byRoute[t.route] += t.fare || 0
    })
    return byRoute
  }

  // Get boarded count by route
  const getBoardedByRoute = () => {
    const byRoute = {}
    tickets.filter(t => t.status === 'boarded').forEach(t => {
      if (!byRoute[t.route]) byRoute[t.route] = 0
      byRoute[t.route] += 1
    })
    return byRoute
  }

  return {
    tickets,
    stats,
    getRevenueByRoute,
    getBoardedByRoute,
    getAllTickets: () => getAllTickets(),
  }
}
