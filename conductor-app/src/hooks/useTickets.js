/**
 * useTickets Hook
 * Real-time ticket management with localStorage synchronization
 * Used by Conductor App to monitor and manage passenger tickets
 */

import { useState, useEffect, useCallback } from 'react'
import { getStoredTickets, subscribeToTicketChanges } from '../utils/ticketStorage'

export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize tickets from localStorage
  useEffect(() => {
    const initialTickets = getStoredTickets()
    setTickets(initialTickets)
    setLoading(false)
  }, [])

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToTicketChanges((updatedTickets) => {
      setTickets(updatedTickets)
    })

    return () => unsubscribe()
  }, [])

  // Get tickets for a specific route
  const getTicketsByRoute = useCallback((routeId) => {
    return tickets.filter(t => t.route === routeId)
  }, [tickets])

  // Get boarded count for a route
  const getBoardedCount = useCallback((routeId) => {
    const routeTickets = getTicketsByRoute(routeId)
    return routeTickets.filter(t => t.status === 'boarded').length
  }, [getTicketsByRoute])

  // Get total booked count for a route
  const getBookedCount = useCallback((routeId) => {
    return getTicketsByRoute(routeId).length
  }, [getTicketsByRoute])

  // Get a specific ticket
  const getTicket = useCallback((ticketId) => {
    return tickets.find(t => t.id === ticketId)
  }, [tickets])

  return {
    tickets,
    loading,
    getTicketsByRoute,
    getBoardedCount,
    getBookedCount,
    getTicket,
  }
}
