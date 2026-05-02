import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { User } from '../../models/User.js'
import { env } from '../../config/env.js'
import { signAccessToken, signRefreshToken } from '../../middleware/auth.js'
import { validateBody } from '../../middleware/validate.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(['passenger', 'conductor', 'depot_admin']).default('passenger'),
})

router.post('/register', validateBody(registerSchema), async (req, res) => {
  const exists = await User.findOne({ email: req.body.email }).lean()
  if (exists) return res.status(409).json({ error: 'User already exists' })

  const passwordHash = await bcrypt.hash(req.body.password, 10)
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    passwordHash,
    role: req.body.role,
  })

  const payload = { sub: user._id.toString(), email: user.email, role: user.role, name: user.name }
  return res.status(201).json({
    user: payload,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  })
})

router.post('/login', validateBody(loginSchema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(req.body.password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const payload = { sub: user._id.toString(), email: user.email, role: user.role, name: user.name }
  return res.json({
    user: payload,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  })
})

router.post('/refresh', async (req, res) => {
  const token = req.body?.refreshToken
  if (!token) return res.status(400).json({ error: 'Missing refresh token' })
  try {
    const decoded = jwt.verify(token, env.refreshSecret)
    const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role, name: decoded.name }
    return res.json({ accessToken: signAccessToken(payload) })
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
})

router.post('/logout', async (req, res) => {
  return res.json({ success: true })
})

export default router
