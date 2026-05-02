export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  req.log?.error?.(err)
  res.status(500).json({ error: 'Internal server error' })
}
