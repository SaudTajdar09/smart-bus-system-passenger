let socket = null

/**
 * Returns a Socket.IO-compatible client when VITE_SOCKET_URL is set.
 * Otherwise returns null (hooks should no-op).
 */
export function getSocket() {
  return socket
}

export function connectSocket(url) {
  if (!url || socket) return socket
  // Wire socket.io-client here when backend is ready:
  // import { io } from 'socket.io-client'
  // socket = io(url, { autoConnect: true })
  return socket
}

export function disconnectSocket() {
  if (socket?.disconnect) socket.disconnect()
  socket = null
}
