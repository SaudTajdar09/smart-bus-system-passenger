/**
 * Ticket Storage Utilities - API-Based
 * Used by Passenger App - communicates with ticket-server.js
 */

const API_URL = 'http://localhost:3001/api'
const STORAGE_KEY = 'citybus_tickets'
const STORAGE_EVENT = 'citybus:ticketsUpdated'

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
    return tickets
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
 * Save a new ticket via API
 */
export async function saveTicket(ticketData, options = {}) {
  try {
    const { status = 'booked', scanTime = null } = options
    
    const newTicket = {
      id: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    const result = await response.json()
    
    console.log('💾 Ticket saved to server:', newTicket.id)
    console.log('📊 Ticket object:', newTicket)
    
    // Update localStorage cache
    const tickets = await getStoredTickets()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    
    // Trigger custom event for real-time updates
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: tickets }))
    
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
    
    if (!response.ok) throw new Error('Update failed')
    
    // Update localStorage cache
    const tickets = await getStoredTickets()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    console.log('✅ Ticket status updated:', ticketId, '→', newStatus)
    
    // Trigger custom event for real-time updates
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: tickets }))
    
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
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: [] }))
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
  const handleStorageChange = (event) => {
    if (event.detail) {
      callback(event.detail)
    }
  }
  
  window.addEventListener(STORAGE_EVENT, handleStorageChange)
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(STORAGE_EVENT, handleStorageChange)
  }
}

/**
 * Get tickets for a specific route
 */
export function getTicketsByRoute(routeId) {
  const tickets = getStoredTickets()
  return tickets.filter(t => t.route === routeId)
}

/**
 * Get boarded count for a route
 */
export function getBoardedCount(routeId) {
  const tickets = getTicketsByRoute(routeId)
  return tickets.filter(t => t.status === 'boarded').length
}

/**
 * Get total booked count for a route
 */
export function getBookedCount(routeId) {
  return getTicketsByRoute(routeId).length
}
