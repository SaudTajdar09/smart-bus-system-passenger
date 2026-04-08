/**
 * Full-route fare scaled by number of stop-to-stop segments traveled.
 * Minimum one segment; at least ₹1 per segment floor for demo stability.
 */
export function fareForSegment(route, boardIndex, alightIndex) {
  if (!route?.stops?.length) return route?.fare ?? 0
  const n = route.stops.length
  if (n < 2) return route.fare
  const segments = Math.max(1, alightIndex - boardIndex)
  const maxSegments = n - 1
  const raw = (route.fare * segments) / maxSegments
  return Math.max(1, Math.round(raw))
}

export function isValidStopPair(boardIndex, alightIndex, stopCount) {
  return (
    boardIndex >= 0 &&
    alightIndex < stopCount &&
    boardIndex < alightIndex
  )
}
