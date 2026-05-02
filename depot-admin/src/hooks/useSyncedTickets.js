import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const TICKETS_API_URL = `${API_BASE_URL}/api/tickets`

function computeTicketStats(tickets = []) {
  return {
    totalTickets: tickets.length,
    bookedTickets: tickets.filter((t) => t.status === 'booked').length,
    boardedTickets: tickets.filter((t) => t.status === 'boarded').length,
    totalRevenue: tickets.reduce((sum, t) => sum + (t.fare || 0), 0),
    totalPassengers: tickets.filter((t) => t.status === 'boarded').length,
  }
}

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

  useEffect(() => {
    let isActive = true

    const pollTickets = async () => {
      try {
        const response = await fetch(TICKETS_API_URL)
        if (!response.ok) return
        const apiTickets = await response.json()
        if (!isActive) return
        setTickets(apiTickets)
        const newStats = computeTicketStats(apiTickets)
        setStats(newStats)
      } catch {
        // Keep previous values during transient API failures.
      }
    }

    pollTickets()
    const interval = setInterval(pollTickets, 3000)

    return () => {
      isActive = false
      clearInterval(interval)
    }
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
    getAllTickets: () => tickets,
  }
}
