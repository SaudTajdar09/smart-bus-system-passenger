import { useEffect, useState, useMemo } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'
import { TrackMapSvg } from '../components/passenger/TrackMapSvg.jsx'
import { LiveBusCard } from '../components/passenger/LiveBusCard.jsx'
import { BUSES, ROUTES } from '../data/cityBusData.js'

export function Track() {
  const [liveTickets, setLiveTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tickets from API and update every 5 seconds
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tickets')
        if (response.ok) {
          const tickets = await response.json()
          setLiveTickets(tickets)
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch live occupancy:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch immediately
    fetchTickets()

    // Poll every 5 seconds (longer scanning period)
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [])

  // Calculate live occupancy for each bus based on tickets
  const liveOccupancy = useMemo(() => {
    const occupancy = {}

    // Initialize all routes with 0
    ROUTES.forEach(route => {
      occupancy[route.id] = {
        totalBoarded: 0,
        totalBooked: 0,
      }
    })

    // Count tickets by route and status
    liveTickets.forEach(ticket => {
      if (occupancy[ticket.route]) {
        if (ticket.status === 'boarded' || ticket.status === 'expired') {
          occupancy[ticket.route].totalBoarded++
        } else if (ticket.status === 'booked') {
          occupancy[ticket.route].totalBooked++
        }
      }
    })

    return occupancy
  }, [liveTickets])

  // Create enhanced bus data with live occupancy
  const enhancedBuses = useMemo(() => {
    return BUSES.map(bus => {
      const occupancyData = liveOccupancy[bus.route] || { totalBoarded: 0, totalBooked: 0 }
      const busOccupancy = occupancyData.totalBoarded + occupancyData.totalBooked
      
      return {
        ...bus,
        occupancy: busOccupancy,
        boardedCount: occupancyData.totalBoarded,
      }
    })
  }, [liveOccupancy])

  return (
    <>
      <SectionTitle>Live bus tracking</SectionTitle>
      <DemoNote>Real-time occupancy — updates from live ticket data</DemoNote>
      <div className="mb-4 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm">
        <TrackMapSvg />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="mb-4 rounded-2xl border border-white/60 bg-white/90 p-4 text-center text-sm text-cb-text-secondary">
          Loading live data...
        </div>
      )}

      {/* Bus Cards with live occupancy */}
      {enhancedBuses.map((b) => (
        <LiveBusCard key={b.id} bus={b} />
      ))}
    </>
  )
}
