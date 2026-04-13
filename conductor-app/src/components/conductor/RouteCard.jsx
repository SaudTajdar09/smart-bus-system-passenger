import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'

export function RouteCard({ route }) {
  if (!route) return null

  return (
    <Card className="mb-6 p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-cb-text-secondary">Current Route</p>
          <p className="text-lg font-bold text-cb-text">{route.name}</p>
        </div>
        <Badge variant="info">{route.type}</Badge>
      </div>

      <div className="mb-3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mb-3">
        <p className="text-xs font-semibold text-cb-text-secondary mb-2">Stops ({route.stops.length})</p>
        <div className="space-y-1">
          {route.stops.map((stop, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                {idx + 1}
              </span>
              <span className="text-sm text-cb-text">{stop}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-3" />

      <div>
        <p className="text-xs text-cb-text-secondary">Capacity: {route.capacity} seats</p>
      </div>
    </Card>
  )
}
