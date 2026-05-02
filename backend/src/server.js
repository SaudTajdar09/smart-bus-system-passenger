import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

async function bootstrap() {
  await connectDB()

  const httpServer = http.createServer()
  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next()
    try {
      socket.user = jwt.verify(token, env.accessSecret)
      return next()
    } catch {
      return next(new Error('Unauthorized socket token'))
    }
  })

  io.on('connection', (socket) => {
    socket.on('join.route', (routeId) => {
      if (typeof routeId === 'string' && routeId.trim()) {
        socket.join(`route:${routeId}`)
      }
    })

    socket.on('leave.route', (routeId) => {
      if (typeof routeId === 'string' && routeId.trim()) {
        socket.leave(`route:${routeId}`)
      }
    })
  })

  const app = createApp(io)
  httpServer.removeAllListeners('request')
  httpServer.on('request', app)

  httpServer.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start backend', err)
  process.exit(1)
})
