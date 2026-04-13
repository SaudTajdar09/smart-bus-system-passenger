/**
 * Ticket Storage Utilities - API-Based
 * Used by Conductor App - communicates with ticket-server.js
 */

const API_URL = 'http://localhost:3001/api'
const STORAGE_KEY = 'citybus_tickets'
const STORAGE_EVENT = 'citybus:ticketsUpdated'
const SERIAL_COUNTER_KEY = 'citybus_ticket_serial_counter'

/**
 * Get next serial number for ticket ID
 */
function getNextSerialNumber() {
  const current = parseInt(localStorage.getItem(SERIAL_COUNTER_KEY) || '1000', 10)
  const next = current + 1
  localStorage.setItem(SERIAL_COUNTER_KEY, next.toString())
  return next
}

/**
 * Get all tickets from API (with localStorage fallback)
 */
export async function getStoredTickets() {
  try {
    const response = await fetch(`${API_URL}/tickets`)
    if (!response.ok) throw new Error('API failed')
    const tickets = await response.json()
    
    // Update localStorage cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    
    // Enrich with synced data (passenger names, serial numbers)
    return enrichTicketsWithSyncedData(tickets)
  } catch (error) {
    console.warn('⚠️ API unavailable, using localStorage cache')
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }
}

/**
 * Enrich API tickets with synced data from localStorage
 * This adds passengerName and manualSerial from the sync system
 */
function enrichTicketsWithSyncedData(apiTickets) {
  try {
    // Get synced tickets from localStorage
    const syncedData = localStorage.getItem('citybus_synced_tickets')
    if (!syncedData) {
      console.log('ℹ️ No synced tickets found in localStorage')
      return apiTickets
    }
    
    const syncedTickets = JSON.parse(syncedData)
    const syncedMap = new Map(syncedTickets.map(t => [t.id, t]))
    
    console.log(`📦 Found ${syncedTickets.length} synced tickets in localStorage`)
    console.log(`📦 Looking to enrich ${apiTickets.length} API tickets`)
    
    // Enrich API tickets with synced data
    const enriched = apiTickets.map(apiTicket => {
      const syncedTicket = syncedMap.get(apiTicket.id)
      if (syncedTicket) {
        console.log(`✅ Enriched ticket ${apiTicket.id} with passengerName: ${syncedTicket.passengerName}`)
        return {
          ...apiTicket,
          passengerName: syncedTicket.passengerName || apiTicket.passengerName,
          manualSerial: syncedTicket.manualSerial || apiTicket.manualSerial,
          createdFrom: syncedTicket.createdFrom || apiTicket.createdFrom,
        }
      }
      return apiTicket
    })
    
    return enriched
  } catch (error) {
    console.warn('⚠️ Error enriching tickets with synced data:', error)
    return apiTickets
  }
}

/**
 * Save a new ticket via API
 */
export async function saveTicket(ticketData, options = {}) {
  try {
    const { status = 'booked', scanTime = null } = options
    
    const serialNumber = getNextSerialNumber()
    const newTicket = {
      id: `TKT-${serialNumber}`,
      ...ticketData,
      status,
      createdAt: new Date().toISOString(),
      scanTime,
    }
    
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket),
    })
    
    if (!response.ok) throw new Error('Save failed')
    
    console.log('💾 Ticket saved to server:', newTicket.id)
    
    // Update localStorage cache
    const tickets = await getStoredTickets()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    
    return newTicket
  } catch (error) {
    console.error('❌ Error saving ticket:', error)
    return null
  }
}

/**
 * Update a ticket's status via API
 */
export async function updateTicketStatus(ticketId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    
    if (!response.ok) {
      // Check if ticket exists in API
      const allTickets = await getStoredTickets()
      const exists = allTickets.find(t => t.id === ticketId)
      if (!exists) {
        console.error(`❌ Ticket ${ticketId} not found. Available:`, allTickets.map(t => t.id))
      }
      throw new Error('Update failed')
    }
    
    // Update localStorage cache
    const tickets = await getStoredTickets()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    
    console.log('✅ Ticket status updated:', ticketId, '→', newStatus)
    console.log('📊 Boarded count:', tickets.filter(t => t.status === 'boarded').length)
    
    return tickets.find(t => t.id === ticketId)
  } catch (error) {
    console.error('❌ Error updating ticket:', error)
    return null
  }
}

/**
 * Delete all tickets (for demo purposes)
 */
export async function clearAllTickets() {
  try {
    await fetch(`${API_URL}/tickets`, { method: 'DELETE' })
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ All tickets cleared')
  } catch (error) {
    console.error('❌ Error clearing tickets:', error)
  }
}

/**
 * Subscribe to ticket changes
 * Polls API for updates every 2 seconds
 * Returns unsubscribe function
 */
export function subscribeToTicketChanges(callback) {
  let isSubscribed = true
  
  // Poll API every 5 seconds (longer scanning period)
  const pollInterval = setInterval(async () => {
    if (!isSubscribed) return
    
    try {
      const tickets = await getStoredTickets()
      callback(tickets)
    } catch (error) {
      console.warn('Poll error:', error)
    }
  }, 5000)
  
  // Return unsubscribe function
  return () => {
    isSubscribed = false
    clearInterval(pollInterval)
  }
}

/**
 * Get tickets for a specific route
 */
export async function getTicketsByRoute(routeId) {
  const tickets = await getStoredTickets()
  return tickets.filter(t => t.route === routeId)
}

/**
 * Get boarded count for a route
 */
export async function getBoardedCount(routeId) {
  const tickets = await getTicketsByRoute(routeId)
  return tickets.filter(t => t.status === 'boarded').length
}

/**
 * Get total booked count for a route
 */
export async function getBookedCount(routeId) {
  return (await getTicketsByRoute(routeId)).length
}

