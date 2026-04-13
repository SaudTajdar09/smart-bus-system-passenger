import { useCallback, useMemo, useState, useEffect } from 'react'
import { ConductorContext } from './conductor-context.js'
import { CURRENT_CONDUCTOR, CONDUCTOR_ROUTES } from '../data/conductorData.js'
import { getStoredTickets, updateTicketStatus, subscribeToTicketChanges } from '../utils/ticketStorage.js'
import { generatePassengerName, generateSeatNumber } from '../utils/passengerNames.js'

export function ConductorProvider({ children }) {
  const [passengers, setPassengers] = useState([])
  const [currentRoute, setCurrentRoute] = useState('R1')
  const [currentStop, setCurrentStop] = useState('Station')
  const [scanFeedback, setScanFeedback] = useState(null) // { type: 'success'|'error', message, ticketId }
  const [recentlyScanned, setRecentlyScanned] = useState(new Map()) // Track recently scanned tickets
  const [popupNotification, setPopupNotification] = useState(null) // { title, message, type }

  // Load tickets from API on mount
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const tickets = await getStoredTickets()
        const passengers = tickets.map((ticket) => ({
          id: ticket.id,
          seat: ticket.seat || generateSeatNumber(ticket.id),
          // Use actual passenger name from ticket if available (from Passenger App)
          // Otherwise use generated name for manual tickets
          name: ticket.passengerName || ticket.manualSerial || generatePassengerName(ticket.id),
          route: ticket.route,
          from: ticket.from,
          to: ticket.to,
          status: ticket.status,
          scanTime: ticket.scanTime,
          createdFrom: ticket.createdFrom, // 'app' or 'manual'
          manualSerial: ticket.manualSerial, // Serial for manual tickets
        }))
        setPassengers(passengers)
        console.log('🚀 Initial load from API:', passengers.length, 'total passengers across all routes')
      } catch (error) {
        console.error('❌ Failed to load tickets:', error)
      }
    }
    loadTickets()
  }, [])

  // Subscribe to real-time ticket updates
  useEffect(() => {
    // Start polling for ticket updates from API
    const unsubscribe = subscribeToTicketChanges((updatedTickets) => {
      // Keep ALL tickets in state, filter by route happens in useMemo below
      const passengers = updatedTickets.map((ticket) => ({
        id: ticket.id,
        seat: ticket.seat || generateSeatNumber(ticket.id),
        // Use actual passenger name from ticket if available (from Passenger App)
        // Otherwise use generated name for manual tickets
        name: ticket.passengerName || ticket.manualSerial || generatePassengerName(ticket.id),
        route: ticket.route,
        from: ticket.from,
        to: ticket.to,
        status: ticket.status,
        scanTime: ticket.scanTime,
        createdFrom: ticket.createdFrom, // 'app' or 'manual'
        manualSerial: ticket.manualSerial, // Serial for manual tickets
      }))
      
      setPassengers(passengers)
      console.log(`🔄 Polling: ${passengers.length} total passengers across all routes`)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const route = useMemo(() => {
    return CONDUCTOR_ROUTES.find((r) => r.id === currentRoute)
  }, [currentRoute])

  // Count passengers by status for currentRoute
  const routePassengers = useMemo(() => {
    return passengers.filter((p) => p.route === currentRoute)
  }, [passengers, currentRoute])

  const boardedCount = useMemo(() => {
    return routePassengers.filter((p) => p.status === 'boarded' || p.status === 'expired').length
  }, [routePassengers])

  const totalCapacity = route?.capacity ?? 40

  // Play notification sounds
  const playNotificationSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const now = audioContext.currentTime
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      
      osc.connect(gain)
      gain.connect(audioContext.destination)
      
      if (type === 'success') {
        // Success: two ascending beeps
        osc.frequency.setValueAtTime(800, now)
        osc.frequency.setValueAtTime(1000, now + 0.1)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.setValueAtTime(0, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      } else if (type === 'duplicate') {
        // Duplicate: two beeps same frequency
        osc.frequency.setValueAtTime(600, now)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.setValueAtTime(0, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
        
        osc.start(now + 0.2)
        osc.stop(now + 0.35)
      } else if (type === 'error') {
        // Error: low descending beep
        osc.frequency.setValueAtTime(400, now)
        osc.frequency.setValueAtTime(300, now + 0.1)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.setValueAtTime(0, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      }
    } catch (e) {
      console.warn('Audio notification not available')
    }
  }

  // Scan ticket - mark passenger as boarded and expire after scanning
  const scanTicket = useCallback(
    async (ticketId) => {
      const passenger = passengers.find((p) => p.id === ticketId)

      if (!passenger) {
        setScanFeedback({
          type: 'error',
          message: '❌ Invalid ticket',
          ticketId,
        })
        setTimeout(() => setScanFeedback(null), 3000)
        return false
      }

      // ROUTE VALIDATION - verify ticket is for current route
      if (passenger.route !== currentRoute) {
        setScanFeedback({
          type: 'error',
          message: `⚠️ ROUTE MISMATCH! Ticket is for Route ${passenger.route}`,
          ticketId,
        })
        const routeName = CONDUCTOR_ROUTES.find(r => r.id === passenger.route)?.name || passenger.route
        const currentRouteName = CONDUCTOR_ROUTES.find(r => r.id === currentRoute)?.name || currentRoute
        setPopupNotification({
          title: '❌ Cannot Board - Wrong Route!',
          message: `This ticket is for ${routeName}, but bus is on ${currentRouteName}`,
          type: 'error',
        })
        setTimeout(() => setScanFeedback(null), 4000)
        setTimeout(() => setPopupNotification(null), 4000)
        playNotificationSound('error')
        return false
      }

      // Check for duplicate scan (scanned within last 30 seconds)
      const lastScanTime = recentlyScanned.get(ticketId)
      if (lastScanTime && Date.now() - lastScanTime < 30000) {
        // Show popup for duplicate scan
        setPopupNotification({
          title: '⚠️ Duplicate Scan!',
          message: `${passenger.name} was already scanned ${Math.floor((Date.now() - lastScanTime) / 1000)} seconds ago`,
          type: 'warning',
        })
        setTimeout(() => setPopupNotification(null), 4000)
        return false
      }

      if (passenger.status === 'expired') {
        setScanFeedback({
          type: 'error',
          message: '❌ Ticket expired',
          ticketId,
        })
        setTimeout(() => setScanFeedback(null), 3000)
        return false
      }

      // Update recently scanned tracking
      setRecentlyScanned((prev) => new Map(prev).set(ticketId, Date.now()))

      // Update status in API to 'expired' (expires after boarding)
      await updateTicketStatus(ticketId, 'expired')

      // Mark as expired in local state
      setPassengers((prev) =>
        prev.map((p) =>
          p.id === ticketId
            ? {
                ...p,
                status: 'expired',
                scanTime: new Date().toISOString(),
              }
            : p,
        ),
      )

      setScanFeedback({
        type: 'success',
        message: `✅ ${passenger.name} boarded & expired`,
        ticketId,
      })
      
      // Show success popup
      setPopupNotification({
        title: '✅ Ticket Verified!',
        message: `${passenger.name} - Seat ${passenger.seat}`,
        type: 'success',
      })
      
      // Play audio ONLY on successful completion
      playNotificationSound('success')
      
      setTimeout(() => setScanFeedback(null), 4000)
      setTimeout(() => setPopupNotification(null), 4000)
      return true
    },
    [passengers, recentlyScanned],
  )

  // Simulate passenger booking (for demo)
  const simulateNewBooking = useCallback(() => {
    const newTicket = {
      id: `TKT-${Date.now()}`,
      seat: `${Math.floor(Math.random() * 40) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
      name: ['Alex', 'Sam', 'Pat', 'Jordan', 'Casey'][Math.floor(Math.random() * 5)],
      route: currentRoute,
      from: route?.stops[0] || 'Station',
      to: route?.stops[route.stops.length - 1] || 'End',
      status: 'booked',
      scanTime: null,
    }
    setPassengers((prev) => [...prev, newTicket])
  }, [currentRoute, route])

  // Reset for new route
  const changeRoute = useCallback((routeId) => {
    setCurrentRoute(routeId)
    setCurrentStop('Station')
    setScanFeedback(null)
  }, [])

  const value = useMemo(
    () => ({
      // State
      passengers: routePassengers,
      currentRoute,
      currentStop,
      route,
      boardedCount,
      totalCapacity,
      scanFeedback,
      popupNotification,

      // Actions
      scanTicket,
      simulateNewBooking,
      changeRoute,
      setCurrentStop,
      setScanFeedback,
    }),
    [
      routePassengers,
      currentRoute,
      currentStop,
      route,
      boardedCount,
      totalCapacity,
      scanFeedback,
      popupNotification,
      scanTicket,
      simulateNewBooking,
      changeRoute,
    ],
  )

  return <ConductorContext.Provider value={value}>{children}</ConductorContext.Provider>
}
