// API service - ready for backend integration
export const api = {
  baseUrl: 'http://localhost:3000/api',

  // Conductor operations
  async getPassengers(routeId) {
    // TODO: return fetch(`${this.baseUrl}/conductor/passengers/${routeId}`).then(r => r.json())
    console.log('Fetching passengers for route:', routeId)
    return []
  },

  async scanTicket(ticketId) {
    // TODO: return fetch(`${this.baseUrl}/conductor/scan`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ticketId })
    // }).then(r => r.json())
    console.log('Scanning ticket:', ticketId)
    return { success: true }
  },

  async updatePassengerStatus(ticketId, status) {
    // TODO: return fetch(`${this.baseUrl}/conductor/passenger/${ticketId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // }).then(r => r.json())
    console.log('Updating passenger status:', ticketId, status)
    return { success: true }
  },

  async getRouteInfo(routeId) {
    // TODO: return fetch(`${this.baseUrl}/routes/${routeId}`).then(r => r.json())
    console.log('Fetching route info:', routeId)
    return {}
  },
}
