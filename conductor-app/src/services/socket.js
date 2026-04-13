// Socket.IO service - ready for backend integration
export const socketService = {
  // Config
  serverUrl: 'http://localhost:3000',
  reconnect: true,
  reconnectDelay: 1000,

  // Will be implemented when backend is ready
  connect() {
    // TODO: io(this.serverUrl, { reconnection: this.reconnect })
    console.log('Socket service ready for backend integration')
  },

  // Event listeners (to be implemented)
  on(event, callback) {
    console.log(`Listening for: ${event}`)
    // socket.on(event, callback)
  },

  // Emit events
  emit(event, data) {
    console.log(`Emitting: ${event}`, data)
    // socket.emit(event, data)
  },

  // Conductor-specific events
  onTicketBooked(callback) {
    this.on('ticketBooked', callback)
  },

  onTicketScanned(callback) {
    this.on('ticketScanned', callback)
  },

  onPassengerUpdate(callback) {
    this.on('passengerUpdate', callback)
  },

  emitScan(ticketData) {
    this.emit('scanTicket', ticketData)
  },
}
