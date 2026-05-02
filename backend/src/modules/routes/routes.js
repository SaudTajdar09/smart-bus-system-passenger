import { Router } from 'express'
import { Route } from '../../models/Route.js'

const router = Router()

router.get('/', async (req, res) => {
  const routes = await Route.find({}).sort({ id: 1 }).lean()
  res.json(routes)
})

export default router
