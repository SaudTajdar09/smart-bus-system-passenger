import { Router } from 'express'
import { z } from 'zod'
import { Alert } from '../../models/Alert.js'
import { Incident } from '../../models/Incident.js'
import { validateBody } from '../../middleware/validate.js'

const router = Router()

const createAlertSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1).default('Depot'),
  passengerName: z.string().optional(),
  passengerEmail: z.string().optional(),
  route: z.string().optional(),
  location: z.string().optional(),
  timestamp: z.string().optional(),
  status: z.string().optional(),
}).passthrough()

const patchAlertSchema = z.object({
  status: z.string().min(1),
})

router.get('/', async (req, res) => {
  const alerts = await Alert.find({}).sort({ createdAt: -1 }).lean()
  res.json(alerts)
})

router.post('/', validateBody(createAlertSchema), async (req, res) => {
  const exists = await Alert.findOne({ id: req.body.id }).lean()
  if (exists) return res.status(409).json({ error: 'Alert already exists' })

  const alertPayload = {
    ...req.body,
    status: req.body.status || 'active',
    timestamp: req.body.timestamp || new Date().toISOString(),
  }
  const alert = await Alert.create(alertPayload)

  // Domain sync: every alert creates/links a pending incident
  const incidentId = `INC-ALERT-${alert.id}`
  const incident = await Incident.findOneAndUpdate(
    { id: incidentId },
    {
      id: incidentId,
      alertId: alert.id,
      busId: alert.route ? `Route ${alert.route}` : 'Route Unknown',
      type: 'SOS',
      description: `${alert.type} alert from ${alert.passengerName || 'Unknown Passenger'} (${alert.passengerEmail || 'unknown'})`,
      status: 'pending',
      route: alert.route || 'R1',
      source: 'alert',
      timestamp: alert.timestamp,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean()

  req.io.emit('alert.created', alert.toObject())
  req.io.emit('incident.updated', incident)
  res.status(201).json({ success: true, alert })
})

router.patch('/:id', validateBody(patchAlertSchema), async (req, res) => {
  const alert = await Alert.findOneAndUpdate(
    { id: req.params.id },
    { status: req.body.status, updatedAt: Date.now() },
    { new: true },
  ).lean()
  if (!alert) return res.status(404).json({ error: 'Alert not found' })

  const incident = await Incident.findOneAndUpdate(
    { id: `INC-ALERT-${alert.id}` },
    { status: alert.status === 'active' ? 'pending' : 'resolved' },
    { new: true },
  ).lean()

  req.io.emit('alert.resolved', alert)
  if (incident) req.io.emit('incident.updated', incident)
  res.json({ success: true, alert })
})

router.delete('/', async (req, res) => {
  await Alert.deleteMany({})
  await Incident.deleteMany({ source: 'alert' })
  req.io.emit('alert.cleared')
  req.io.emit('incident.cleared')
  res.json({ success: true })
})

export default router
