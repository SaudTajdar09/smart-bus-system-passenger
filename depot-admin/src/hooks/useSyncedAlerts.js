import { useEffect, useState } from 'react'
import {
  getAllAlerts,
  onAlertsChange,
  computeAlertStats,
} from '../utils/alertStorage.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const ALERTS_API_URL = `${API_BASE_URL}/api/alerts`

/**
 * Hook for Depot Admin to listen to emergency alerts
 */
export function useSyncedAlerts() {
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    handleAlerts: 0,
    medicalAlerts: 0,
    depotAlerts: 0,
  })
  const [newAlert, setNewAlert] = useState(null) // For popup notifications

  // Load initial alerts on mount
  useEffect(() => {
    const loadInitialAlerts = async () => {
      try {
        const response = await fetch(ALERTS_API_URL)
        if (response.ok) {
          const apiAlerts = await response.json()
          setAlerts(apiAlerts)
          setStats(computeAlertStats(apiAlerts))
          console.log('✅ Depot loaded initial alerts from API:', apiAlerts.length)
          return
        }
      } catch (error) {
        console.warn('⚠️ Alerts API unavailable, falling back to localStorage')
      }

      const initialAlerts = getAllAlerts()
      setAlerts(initialAlerts)
      setStats(computeAlertStats(initialAlerts))
      console.log('✅ Depot loaded initial alerts from localStorage:', initialAlerts.length)
    }

    loadInitialAlerts()
  }, [])

  // Poll alerts from API for cross-app syncing (different localhost ports)
  useEffect(() => {
    let dismissTimer = null

    const applyIncomingAlerts = (updatedAlerts) => {
      setAlerts((prevAlerts) => {
        const oldAlertIds = new Set(prevAlerts.map((a) => a.id))
        const incomingNewAlerts = updatedAlerts.filter((a) => !oldAlertIds.has(a.id))

        if (incomingNewAlerts.length > 0) {
          setNewAlert(incomingNewAlerts[0])
          console.log('🚨 NEW ALERT RECEIVED:', incomingNewAlerts[0])

          if (dismissTimer) clearTimeout(dismissTimer)
          dismissTimer = setTimeout(() => setNewAlert(null), 8000)
        }

        return updatedAlerts
      })

      const newStats = computeAlertStats(updatedAlerts)
      setStats(newStats)
      console.log('✅ Depot alerts updated - Active:', newStats.activeAlerts)
    }

    const pollAlerts = async () => {
      try {
        const response = await fetch(ALERTS_API_URL)
        if (!response.ok) return
        const apiAlerts = await response.json()
        applyIncomingAlerts(apiAlerts)
      } catch {
        // Ignore transient polling errors; localStorage listener still runs.
      }
    }

    pollAlerts()
    const interval = setInterval(pollAlerts, 3000)

    return () => {
      if (dismissTimer) clearTimeout(dismissTimer)
      clearInterval(interval)
    }
  }, [])

  // Subscribe to real-time alert changes
  useEffect(() => {
    let dismissTimer = null

    const unsubscribe = onAlertsChange((updatedAlerts) => {
      setAlerts((prevAlerts) => {
        // Check if there's a new alert compared to previous state
        const oldAlertIds = new Set(prevAlerts.map((a) => a.id))
        const incomingNewAlerts = updatedAlerts.filter((a) => !oldAlertIds.has(a.id))

        if (incomingNewAlerts.length > 0) {
          // Show popup for the first new alert
          setNewAlert(incomingNewAlerts[0])
          console.log('🚨 NEW ALERT RECEIVED:', incomingNewAlerts[0])

          // Auto-dismiss popup after 8 seconds
          if (dismissTimer) clearTimeout(dismissTimer)
          dismissTimer = setTimeout(() => setNewAlert(null), 8000)
        }

        return updatedAlerts
      })

      const newStats = computeAlertStats(updatedAlerts)
      setStats(newStats)
      console.log('✅ Depot alerts updated - Active:', newStats.activeAlerts)
    })

    return () => {
      if (dismissTimer) clearTimeout(dismissTimer)
      unsubscribe()
    }
  }, [])

  // Get alerts by type
  const getAlertsByType = (type) => {
    return alerts.filter((a) => a.type === type && a.status === 'active')
  }

  return {
    alerts,
    stats,
    newAlert,
    dismissAlert: () => setNewAlert(null),
    getAlertsByType,
    getAllAlerts: () => alerts,
  }
}
