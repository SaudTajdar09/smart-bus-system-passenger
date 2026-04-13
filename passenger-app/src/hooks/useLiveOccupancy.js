import { useState, useEffect } from 'react'
import { BUSES } from '../data/cityBusData.js'

export function useLiveOccupancy(routeId, busId) {
  // Get bus capacity from static data
  const bus = busId ? BUSES.find(b => b.id === busId) : BUSES.find(b => b.route === routeId)
  const busCapacity = bus?.capacity || 45

  const [occupancyData, setOccupancyData] = useState({
    occupancy: 0,
    capacity: busCapacity,
    percentage: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tickets')
        if (response.ok) {
          const tickets = await response.json()
          
          // Calculate occupancy for the route
          const routeTickets = tickets.filter(
            (t) => t.route === routeId && (t.status === 'boarded' || t.status === 'expired')
          )
          
          const occupancy = routeTickets.length
          const percentage = Math.round((occupancy / busCapacity) * 100)

          setOccupancyData({
            occupancy,
            capacity: busCapacity,
            percentage,
          })
        }
      } catch (error) {
        console.error('Error fetching occupancy:', error)
        setOccupancyData({
          occupancy: 0,
          capacity: busCapacity,
          percentage: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOccupancy()
    const interval = setInterval(fetchOccupancy, 5000)
    return () => clearInterval(interval)
  }, [routeId, busCapacity])

  return { ...occupancyData, loading }
}
