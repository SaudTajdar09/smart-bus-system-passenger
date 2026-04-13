import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useSyncedTickets } from '../hooks/useSyncedTickets.js'
import { useSyncedAlerts } from '../hooks/useSyncedAlerts.js'

export const DepotContext = createContext()

export function DepotProvider({ children }) {
  const [buses, setBuses] = useState([])
  const [tickets, setTickets] = useState([])
  const [routes, setRoutes] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  // Get synced tickets from localStorage
  const { stats: syncedStats, tickets: syncedTickets } = useSyncedTickets()

  // Get synced alerts from localStorage
  const { alerts, stats: alertStats, newAlert } = useSyncedAlerts()

  // Convert passenger alerts into depot incidents so they appear in Incidents page
  const alertIncidents = useMemo(
    () =>
      alerts.map((alert) => ({
        id: `INC-ALERT-${alert.id}`,
        alertId: alert.id,
        busId: alert.route ? `Route ${alert.route}` : 'Route Unknown',
        type: 'SOS',
        description: `${alert.type} alert from ${alert.passengerName || 'Unknown Passenger'} (${alert.passengerEmail || 'unknown'})`,
        status: alert.status === 'active' ? 'pending' : 'resolved',
        timestamp: alert.timestamp || new Date(alert.createdAt || Date.now()).toISOString(),
        source: 'alert',
      })),
    [alerts],
  )

  const allIncidents = useMemo(
    () => [...alertIncidents, ...incidents],
    [alertIncidents, incidents],
  )

  // Load initial data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load buses
        const storedBuses = localStorage.getItem('depot_buses')
        if (storedBuses) {
          setBuses(JSON.parse(storedBuses))
        } else {
          // Initialize with dummy buses matching passenger app
          const dummyBuses = [
            {
              id: 'KA-01-F-1234',
              route: 'R1',
              driverName: 'Rajesh Kumar',
              conductorName: 'Priya Singh',
              capacity: 40,
              passengerCount: 0,
              status: 'running',
              lastUpdate: new Date().toISOString(),
            },
            {
              id: 'KA-01-F-5678',
              route: 'R2',
              driverName: 'Amit Patel',
              conductorName: 'Deepak Verma',
              capacity: 45,
              passengerCount: 0,
              status: 'running',
              lastUpdate: new Date().toISOString(),
            },
            {
              id: 'KA-01-G-2345',
              route: 'R3',
              driverName: 'Vikram Singh',
              conductorName: 'Arjun Das',
              capacity: 35,
              passengerCount: 0,
              status: 'idle',
              lastUpdate: new Date().toISOString(),
            },
            {
              id: 'KA-01-G-6789',
              route: 'R4',
              driverName: 'Sanjay Rao',
              conductorName: 'Suresh Kumar',
              capacity: 45,
              passengerCount: 0,
              status: 'running',
              lastUpdate: new Date().toISOString(),
            },
          ]
          setBuses(dummyBuses)
          localStorage.setItem('depot_buses', JSON.stringify(dummyBuses))
        }

        // Load routes
        const storedRoutes = localStorage.getItem('depot_routes')
        if (storedRoutes) {
          setRoutes(JSON.parse(storedRoutes))
        } else {
          const dummyRoutes = [
            {
              id: 'R1',
              name: 'University Express',
              stops: ['City Center', 'Engineering College', 'Arts University', 'Medical College', 'Tech Park'],
              busCount: 1,
              distance: 18,
              fare: 15,
            },
            {
              id: 'R2',
              name: 'City Circular',
              stops: ['Central Station', 'Market', 'Hospital', 'Mall', 'Airport'],
              busCount: 1,
              distance: 22,
              fare: 25,
            },
            {
              id: 'R3',
              name: 'School Special',
              stops: ['Residential Zone', 'Primary School', 'Secondary School', 'International School'],
              busCount: 1,
              distance: 12,
              fare: 10,
            },
            {
              id: 'R4',
              name: 'Metro Connect',
              stops: ['Metro North', 'Bus Depot', 'IT Hub', 'SEZ', 'Port'],
              busCount: 1,
              distance: 20,
              fare: 30,
            },
          ]
          setRoutes(dummyRoutes)
          localStorage.setItem('depot_routes', JSON.stringify(dummyRoutes))
        }

        // Load incidents
        const storedIncidents = localStorage.getItem('depot_incidents')
        if (storedIncidents) {
          setIncidents(JSON.parse(storedIncidents))
        } else {
          const dummyIncidents = [
            {
              id: 'INC-001',
              busId: 'KA-01-F-1234',
              type: 'SOS',
              description: 'Passenger medical emergency',
              status: 'pending',
              timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            },
            {
              id: 'INC-002',
              busId: 'KA-01-G-6789',
              type: 'Breakdown',
              description: 'Engine overheating issue',
              status: 'resolved',
              timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
            },
            {
              id: 'INC-003',
              busId: 'KA-01-F-5678',
              type: 'Complaint',
              description: 'Reckless driving reported',
              status: 'pending',
              timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
            },
          ]
          setIncidents(dummyIncidents)
          localStorage.setItem('depot_incidents', JSON.stringify(dummyIncidents))
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading depot data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Polling for ticket updates from the ticket server
  useEffect(() => {
    const pollTickets = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tickets')
        if (response.ok) {
          const data = await response.json()
          setTickets(data)
        }
      } catch (error) {
        console.error('Error polling tickets:', error)
      }
    }

    pollTickets()
    const interval = setInterval(pollTickets, 5000)
    return () => clearInterval(interval)
  }, [])

  // Update buses based on ticket data
  useEffect(() => {
    const updateBusesFromTickets = () => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const busTickets = tickets.filter(
            (t) => t.route === bus.route && (t.status === 'boarded' || t.status === 'expired')
          )
          return {
            ...bus,
            passengerCount: busTickets.length,
            lastUpdate: new Date().toISOString(),
          }
        })
      )
    }

    if (tickets.length > 0) {
      updateBusesFromTickets()
    }
  }, [tickets])

  // Calculated metrics - use synced data for real-time updates
  const stats = useMemo(
    () => ({
      totalBuses: buses.length,
      activeBuses: buses.filter((b) => b.status === 'running').length,
      totalPassengers: syncedStats.boardedTickets || tickets.filter((t) => t.status === 'boarded' || t.status === 'expired').length,
      totalCapacity: buses.reduce((sum, b) => sum + b.capacity, 0),
      occupancyRate: buses.length > 0 
        ? Math.round(
            (buses.reduce((sum, b) => sum + b.passengerCount, 0) / buses.reduce((sum, b) => sum + b.capacity, 0)) * 100
          )
        : 0,
      totalRevenue: syncedStats.totalRevenue || tickets.reduce((sum, t) => sum + (t.fare || 0), 0),
      pendingIncidents: allIncidents.filter((i) => i.status === 'pending').length,
    }),
    [buses, tickets, allIncidents, syncedStats]
  )

  // Functions to update data
  const addIncident = useCallback((incident) => {
    const newIncident = {
      id: `INC-${Date.now()}`,
      ...incident,
      timestamp: new Date().toISOString(),
    }
    setIncidents((prev) => [newIncident, ...prev])
    localStorage.setItem('depot_incidents', JSON.stringify([newIncident, ...incidents]))
  }, [incidents])

  const resolveIncident = useCallback((incidentId) => {
    if (incidentId.startsWith('INC-ALERT-')) {
      const alertId = incidentId.replace('INC-ALERT-', '')
      fetch(`http://localhost:3001/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      }).catch((error) => {
        console.error('Error resolving alert-backed incident:', error)
      })
      return
    }

    setIncidents((prev) => {
      const updated = prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: 'resolved' } : inc
      )
      localStorage.setItem('depot_incidents', JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateBusStatus = useCallback((busId, newStatus) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, status: newStatus, lastUpdate: new Date().toISOString() } : bus
      )
    )
  }, [])

  const updateBusConductor = useCallback((busId, conductorName, driverName) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, conductorName, driverName, lastUpdate: new Date().toISOString() } : bus
      )
    )
    // Save to localStorage
    setBuses((currentBuses) => {
      localStorage.setItem('depot_buses', JSON.stringify(currentBuses))
      return currentBuses
    })
  }, [])

  const value = {
    buses,
    tickets,
    routes,
    incidents: allIncidents,
    alerts,
    alertStats,
    newAlert,
    stats,
    loading,
    addIncident,
    resolveIncident,
    updateBusStatus,
    updateBusConductor,
  }

  return <DepotContext.Provider value={value}>{children}</DepotContext.Provider>
}
