/**
 * Shared Ticket Storage Utility
 * Used across all apps (Passenger, Conductor, Depot Admin) for localStorage sync
 */

const TICKETS_KEY = 'citybus_synced_tickets'
const SYNC_EVENT = 'citybus:ticketsSync'

/**
 * Initialize localStorage with empty array if needed
 */
export function initializeTicketsStorage() {
  if (!localStorage.getItem(TICKETS_KEY)) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify([]))
  }
}

/**
 * Get all tickets from localStorage
 */
export function getAllTickets() {
  try {
    initializeTicketsStorage()
    const data = localStorage.getItem(TICKETS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('❌ Error reading tickets:', error)
    return []
  }
}

/**
 * Add or update a ticket in localStorage
 */
export function saveTicketToStorage(ticket) {
  try {
    const tickets = getAllTickets()
    const index = tickets.findIndex(t => t.id === ticket.id)
    
    if (index >= 0) {
      // Update existing ticket
      tickets[index] = { ...tickets[index], ...ticket }
    } else {
      // Add new ticket
      tickets.push(ticket)
    }
    
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
    
    // Dispatch sync event for real-time updates
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { tickets } }))
    
    return ticket
  } catch (error) {
    console.error('❌ Error saving ticket:', error)
    return null
  }
}

/**
 * Update ticket status (e.g., booked -> boarded)
 */
export function updateTicketStatus(ticketId, newStatus) {
  try {
    const tickets = getAllTickets()
    const ticket = tickets.find(t => t.id === ticketId)
    
    if (ticket) {
      ticket.status = newStatus
      ticket.updatedAt = Date.now()
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { tickets } }))
      return ticket
    }
    
    return null
  } catch (error) {
    console.error('❌ Error updating ticket:', error)
    return null
  }
}

/**
 * Subscribe to ticket changes across all tabs/windows
 */
export function onTicketsChange(callback) {
  // Listen for changes from other tabs
  const handleStorageChange = (e) => {
    if (e.key === TICKETS_KEY) {
      const newTickets = getAllTickets()
      callback(newTickets)
    }
  }

  // Listen for custom sync events within same tab
  const handleSyncEvent = (e) => {
    callback(e.detail.tickets)
  }

  window.addEventListener('storage', handleStorageChange)
  window.addEventListener(SYNC_EVENT, handleSyncEvent)

  // Return unsubscribe function
  return () => {
    window.removeEventListener('storage', handleStorageChange)
    window.removeEventListener(SYNC_EVENT, handleSyncEvent)
  }
}

/**
 * Compute statistics from tickets
 */
export function computeTicketStats(tickets = []) {
  const stats = {
    totalTickets: tickets.length,
    bookedTickets: tickets.filter(t => t.status === 'booked').length,
    boardedTickets: tickets.filter(t => t.status === 'boarded').length,
    totalRevenue: tickets.reduce((sum, t) => sum + (t.fare || 0), 0),
    totalPassengers: tickets.filter(t => t.status === 'boarded').length,
  }
  return stats
}

/**
 * Clear all tickets (use carefully - for testing/reset)
 */
export function clearAllTickets() {
  localStorage.setItem(TICKETS_KEY, JSON.stringify([]))
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { tickets: [] } }))
}
