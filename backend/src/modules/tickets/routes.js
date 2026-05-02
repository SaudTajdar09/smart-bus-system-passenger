import { Router } from 'express'
import { z } from 'zod'
import { Ticket } from '../../models/Ticket.js'
import { validateBody } from '../../middleware/validate.js'

const router = Router()

const createTicketSchema = z.object({
  id: z.string().min(1),
}).passthrough()

const patchTicketSchema = z.object({
  status: z.string().min(1),
})

router.get('/', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
  const query = search ? { id: { $regex: search, $options: 'i' } } : {}
  const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean()
  res.json(tickets)
})

router.post('/', validateBody(createTicketSchema), async (req, res) => {
  const existing = await Ticket.findOne({ id: req.body.id }).lean()
  if (existing) return res.status(409).json({ error: 'Ticket already exists' })
  const ticket = await Ticket.create(req.body)
  req.io.emit('ticket.updated', ticket.toObject())
  res.status(201).json({ success: true, ticket })
})

router.patch('/:id', validateBody(patchTicketSchema), async (req, res) => {
  const payload = { status: req.body.status }
  if (req.body.status === 'boarded') payload.scanTime = new Date().toISOString()

  const ticket = await Ticket.findOneAndUpdate({ id: req.params.id }, payload, {
    new: true,
  }).lean()
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
  req.io.emit('ticket.updated', ticket)
  res.json({ success: true, ticket })
})

router.delete('/', async (req, res) => {
  await Ticket.deleteMany({})
  req.io.emit('ticket.cleared')
  res.json({ success: true })
})

export default router
