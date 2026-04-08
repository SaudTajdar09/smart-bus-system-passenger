import { useEffect, useState } from 'react'
import { connectSocket, disconnectSocket, getSocket } from '../services/socket.js'

export function useSocket() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL
    if (!url) return undefined
    connectSocket(url)
    const s = getSocket()
    if (s?.on) {
      const onConnect = () => setConnected(true)
      const onDisconnect = () => setConnected(false)
      s.on('connect', onConnect)
      s.on('disconnect', onDisconnect)
      setConnected(!!s.connected)
      return () => {
        s.off('connect', onConnect)
        s.off('disconnect', onDisconnect)
        disconnectSocket()
      }
    }
    return undefined
  }, [])

  return { connected, socket: getSocket() }
}
