/**
 * Alert Storage & Sync Utility
 * Syncs emergency alerts from Passenger App to Depot Admin Dashboard
 */

const ALERTS_STORAGE_KEY = 'citybus_synced_alerts'
const ALERT_SYNC_EVENT = 'citybus:alertSync'

/**
 * Initialize alerts storage
 */
export function initializeAlertsStorage() {
  const existing = localStorage.getItem(ALERTS_STORAGE_KEY)
  if (!existing) {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([]))
  }
}

/**
 * Get all alerts from localStorage
 */
export function getAllAlerts() {
  try {
    const data = localStorage.getItem(ALERTS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading alerts:', error)
    return []
  }
}

/**
 * Save a new alert
 */
export function saveAlertToStorage(alertData) {
  try {
    const alert = {
      id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...alertData,
    }

    const alerts = getAllAlerts()
    alerts.push(alert)
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts))

    // Dispatch sync event for real-time updates
    window.dispatchEvent(
      new CustomEvent(ALERT_SYNC_EVENT, {
        detail: { alert, alerts },
      })
    )

    console.log('🚨 Alert saved to localStorage:', alert.id)
    return alert
  } catch (error) {
    console.error('Error saving alert:', error)
    return null
  }
}

/**
 * Update alert status
 */
export function updateAlertStatus(alertId, newStatus) {
  try {
    const alerts = getAllAlerts()
    const alertIndex = alerts.findIndex((a) => a.id === alertId)

    if (alertIndex === -1) {
      console.error('Alert not found:', alertId)
      return null
    }

    alerts[alertIndex].status = newStatus
    alerts[alertIndex].updatedAt = Date.now()

    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts))

    console.log('✅ Alert status updated:', alertId, '→', newStatus)
    return alerts[alertIndex]
  } catch (error) {
    console.error('Error updating alert:', error)
    return null
  }
}

/**
 * Get active alerts only
 */
export function getActiveAlerts() {
  const alerts = getAllAlerts()
  return alerts.filter((a) => a.status === 'active')
}

/**
 * Subscribe to alert changes
 */
export function onAlertsChange(callback) {
  const handleChange = (event) => {
    const alerts = getAllAlerts()
    callback(alerts)
  }

  window.addEventListener(ALERT_SYNC_EVENT, handleChange)

  // Return unsubscribe function
  return () => {
    window.removeEventListener(ALERT_SYNC_EVENT, handleChange)
  }
}

/**
 * Clear all alerts (for demo/testing)
 */
export function clearAllAlerts() {
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([]))
  console.log('🗑️ All alerts cleared')
}

/**
 * Compute alert statistics
 */
export function computeAlertStats(alerts) {
  return {
    totalAlerts: alerts.length,
    activeAlerts: alerts.filter((a) => a.status === 'active').length,
    handleAlerts: alerts.filter((a) => a.type === 'Police').length,
    medicalAlerts: alerts.filter((a) => a.type === 'Hospital').length,
    depotAlerts: alerts.filter((a) => a.type === 'Depot').length,
  }
}
