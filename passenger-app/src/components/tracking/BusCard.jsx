import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'

export function BusCard({ bus }) {
  if (!bus) return null
  const tone = bus.occupancy === 'full' ? 'warn' : 'success'
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 font-semibold">
            Bus {bus.number} · {bus.lineName}
          </p>
          <p className="m-0 text-sm text-app-muted">ETA ~{bus.etaMinutes} min</p>
        </div>
        <Badge tone={tone}>{bus.occupancy}</Badge>
      </div>
    </Card>
  )
}
