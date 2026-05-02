import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { httpLogger } from './config/logger.js'
import authRoutes from './modules/auth/routes.js'
import ticketRoutes from './modules/tickets/routes.js'
import alertRoutes from './modules/alerts/routes.js'
import incidentRoutes from './modules/incidents/routes.js'
import busRoutes from './modules/buses/routes.js'
import routeRoutes from './modules/routes/routes.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'

export function createApp(io) {
  const app = express()

  app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') }))
  app.use(express.json({ limit: '1mb' }))
  app.use(httpLogger)
  app.set('io', io)
  app.use((req, res, next) => {
    req.io = io
    next()
  })

  app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'citybus-backend', uptime: process.uptime() })
  })

  app.get('/version', (req, res) => {
    res.json({ api: 'v1' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/tickets', ticketRoutes)
  app.use('/api/bookings', ticketRoutes)
  app.use('/api/alerts', alertRoutes)
  app.use('/api/incidents', incidentRoutes)
  app.use('/api/buses', busRoutes)
  app.use('/api/routes', routeRoutes)
  // Compatibility paths for existing frontend service wrappers.
  app.use('/tickets', ticketRoutes)
  app.use('/bookings', ticketRoutes)
  app.use('/alerts', alertRoutes)
  app.use('/routes', routeRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
