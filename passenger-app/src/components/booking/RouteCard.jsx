import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { formatCurrency, formatTime } from '../../utils/helpers.js'

export function RouteCard({ route, onSelect }) {
  if (!route) return null
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-1.5 font-semibold">
            {route.from} → {route.to}
          </p>
          <p className="m-0 text-xs text-app-muted">
            Bus {route.busNumber} · Depart {formatTime(route.departAt)} · Arrive {formatTime(route.arriveAt)}
          </p>
        </div>
        <Badge tone="success">{formatCurrency(route.price)}</Badge>
      </div>
      {onSelect ? (
        <button
          type="button"
          className="mt-3 w-full cursor-pointer rounded-lg border border-app-elevated bg-app-elevated py-2 text-sm font-semibold text-app-fg transition-colors hover:border-app-primary"
          onClick={() => onSelect(route)}
        >
          Select route
        </button>
      ) : null}
    </Card>
  )
}
