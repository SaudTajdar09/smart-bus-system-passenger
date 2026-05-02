import { Router } from 'express'
import { Bus } from '../../models/Bus.js'

const router = Router()

router.get('/', async (req, res) => {
  const buses = await Bus.find({}).sort({ createdAt: -1 }).lean()
  res.json(buses)
})

router.put('/:id', async (req, res) => {
  const bus = await Bus.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).lean()
  if (!bus) return res.status(404).json({ error: 'Bus not found' })
  req.io.emit('bus.updated', bus)
  res.json({ success: true, bus })
})

export default router
