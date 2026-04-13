import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// In-memory storage (persists while server runs)
let tickets = []
let alerts = []

// Middleware
app.use(cors())
app.use(express.json())

// GET all tickets
app.get('/api/tickets', (req, res) => {
  console.log('📖 GET /api/tickets - returning', tickets.length, 'tickets')
  res.json(tickets)
})

// POST a new ticket
app.post('/api/tickets', (req, res) => {
  const ticket = req.body
  tickets.push(ticket)
  console.log('💾 POST /api/tickets - saved ticket:', ticket.id)
  console.log('📊 Total tickets:', tickets.length)
  res.json({ success: true, ticket })
})

// UPDATE ticket status
app.patch('/api/tickets/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  const ticket = tickets.find(t => t.id === id)
  if (!ticket) {
    console.error('❌ Ticket not found:', id)
    return res.status(404).json({ error: 'Ticket not found' })
  }
  
  ticket.status = status
  if (status === 'boarded') {
    ticket.scanTime = new Date().toISOString()
  }
  
  console.log('✅ PATCH /api/tickets/' + id, '→', status)
  res.json({ success: true, ticket })
})

// DELETE all tickets (for testing)
app.delete('/api/tickets', (req, res) => {
  tickets = []
  console.log('🗑️  Cleared all tickets')
  res.json({ success: true })
})

// GET all alerts
app.get('/api/alerts', (req, res) => {
  console.log('📖 GET /api/alerts - returning', alerts.length, 'alerts')
  res.json(alerts)
})

// POST a new alert
app.post('/api/alerts', (req, res) => {
  const alert = req.body
  alerts.push(alert)
  console.log('🚨 POST /api/alerts - saved alert:', alert.id)
  console.log('📊 Total alerts:', alerts.length)
  res.json({ success: true, alert })
})

// UPDATE alert status
app.patch('/api/alerts/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const alert = alerts.find((a) => a.id === id)
  if (!alert) {
    console.error('❌ Alert not found:', id)
    return res.status(404).json({ error: 'Alert not found' })
  }

  alert.status = status
  alert.updatedAt = Date.now()

  console.log('✅ PATCH /api/alerts/' + id, '→', status)
  res.json({ success: true, alert })
})

// DELETE all alerts (for testing)
app.delete('/api/alerts', (req, res) => {
  alerts = []
  console.log('🗑️  Cleared all alerts')
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`🚀 Ticket server running on http://localhost:${PORT}`)
})
