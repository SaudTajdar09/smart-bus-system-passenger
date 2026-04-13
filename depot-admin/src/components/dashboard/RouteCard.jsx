import { Card } from '../ui/Card.jsx'

export function RouteCard({ route }) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{route.name}</p>
          <p className="text-xs text-gray-600 mt-1">{route.id}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <p className="text-xs text-gray-600 mb-2">Stops:</p>
            <div className="space-y-1">
              {route.stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-blue-600">●</span>
                  <span className="text-gray-700">{stop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t border-gray-200 pt-3 text-sm">
          <div>
            <p className="text-xs text-gray-600">Distance</p>
            <p className="font-semibold text-gray-900">{route.distance} km</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Buses Active</p>
            <p className="font-semibold text-gray-900">{route.busCount}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
