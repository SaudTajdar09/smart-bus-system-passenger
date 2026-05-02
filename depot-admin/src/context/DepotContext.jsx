import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useSyncedTickets } from '../hooks/useSyncedTickets.js'
import { useSyncedAlerts } from '../hooks/useSyncedAlerts.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

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

  // Load initial data from API (shared backend source of truth)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [busesRes, routesRes, incidentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/buses`),
          fetch(`${API_BASE_URL}/api/routes`),
          fetch(`${API_BASE_URL}/api/incidents`),
        ])

        if (busesRes.ok) setBuses(await busesRes.json())
        if (routesRes.ok) setRoutes(await routesRes.json())
        if (incidentsRes.ok) setIncidents(await incidentsRes.json())

        setLoading(false)
      } catch (error) {
        console.error('Error loading depot data from API:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    setTickets(syncedTickets)
  }, [syncedTickets])

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
    fetch(`${API_BASE_URL}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIncident),
    }).catch((error) => {
      console.error('Error creating incident:', error)
    })
  }, [])

  const resolveIncident = useCallback((incidentId) => {
    if (incidentId.startsWith('INC-ALERT-')) {
      const alertId = incidentId.replace('INC-ALERT-', '')
      fetch(`${API_BASE_URL}/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      }).catch((error) => {
        console.error('Error resolving alert-backed incident:', error)
      })
      return
    }

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: 'resolved' } : inc
      )
    )
    fetch(`${API_BASE_URL}/api/incidents/${incidentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' }),
    }).catch((error) => {
      console.error('Error resolving incident:', error)
    })
  }, [])

  const updateBusStatus = useCallback((busId, newStatus) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, status: newStatus, lastUpdate: new Date().toISOString() } : bus
      )
    )
    fetch(`${API_BASE_URL}/api/buses/${busId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, lastUpdate: new Date().toISOString() }),
    }).catch((error) => {
      console.error('Error updating bus status:', error)
    })
  }, [])

  const updateBusConductor = useCallback((busId, conductorName, driverName) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, conductorName, driverName, lastUpdate: new Date().toISOString() } : bus
      )
    )
    fetch(`${API_BASE_URL}/api/buses/${busId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conductorName, driverName, lastUpdate: new Date().toISOString() }),
    }).catch((error) => {
      console.error('Error updating bus crew:', error)
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
