import { Router } from 'express'
import { z } from 'zod'
import { Incident } from '../../models/Incident.js'
import { Alert } from '../../models/Alert.js'
import { validateBody } from '../../middleware/validate.js'

const router = Router()

const createIncidentSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1),
  description: z.string().min(1),
  busId: z.string().optional(),
  route: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
}).passthrough()

const patchIncidentSchema = z.object({
  status: z.enum(['pending', 'resolved']),
})

router.get('/', async (req, res) => {
  const incidents = await Incident.find({}).sort({ createdAt: -1 }).lean()
  res.json(incidents)
})

router.post('/', validateBody(createIncidentSchema), async (req, res) => {
  const incident = await Incident.create({
    id: req.body.id || `INC-${Date.now()}`,
    ...req.body,
    status: req.body.status || 'pending',
    source: req.body.source || 'manual',
    timestamp: req.body.timestamp || new Date().toISOString(),
  })
  req.io.emit('incident.updated', incident.toObject())
  res.status(201).json({ success: true, incident })
})

router.patch('/:id', validateBody(patchIncidentSchema), async (req, res) => {
  const incident = await Incident.findOneAndUpdate(
    { id: req.params.id },
    { status: req.body.status },
    { new: true },
  ).lean()
  if (!incident) return res.status(404).json({ error: 'Incident not found' })

  if (incident.alertId) {
    const alert = await Alert.findOneAndUpdate(
      { id: incident.alertId },
      { status: req.body.status === 'resolved' ? 'resolved' : 'active' },
      { new: true },
    ).lean()
    if (alert) req.io.emit('alert.resolved', alert)
  }

  req.io.emit('incident.updated', incident)
  res.json({ success: true, incident })
})

export default router
