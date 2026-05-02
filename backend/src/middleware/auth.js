import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccessToken(payload) {
  return jwt.sign(payload, env.accessSecret, { expiresIn: env.accessTtl })
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshTtl })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })

  try {
    req.user = jwt.verify(token, env.accessSecret)
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' })
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    return next()
  }
}
