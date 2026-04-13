import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { Button } from '../ui/Button.jsx'

export function BusCard({ bus, onEdit }) {
  const occupancyPercent = Math.round((bus.passengerCount / bus.capacity) * 100)
  const occupancyClass =
    occupancyPercent > 80 ? 'bg-red-100' : occupancyPercent > 50 ? 'bg-yellow-100' : 'bg-green-100'
  const occupancyTextClass =
    occupancyPercent > 80 ? 'text-red-700' : occupancyPercent > 50 ? 'text-yellow-700' : 'text-green-700'

  const statusVariant = bus.status === 'running' ? 'success' : bus.status === 'idle' ? 'warning' : 'danger'
  const statusLabel = bus.status.charAt(0).toUpperCase() + bus.status.slice(1)

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{bus.id}</p>
            <p className="text-xs text-gray-600 mt-1">{bus.route}</p>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Driver:</span>
            <span className="font-medium text-gray-900">{bus.driverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Conductor:</span>
            <span className="font-medium text-gray-900">{bus.conductorName}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Occupancy</span>
            <span className="font-semibold text-gray-900">
              {bus.passengerCount}/{bus.capacity}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className={`h-full transition-all ${occupancyClass}`} style={{ width: `${occupancyPercent}%` }} />
          </div>
          <p className={`text-xs font-semibold ${occupancyTextClass}`}>{occupancyPercent}% full</p>
        </div>

        {onEdit && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(bus)}
            className="w-full"
          >
            ✏️ Edit Bus Info
          </Button>
        )}
      </div>
    </Card>
  )
}
