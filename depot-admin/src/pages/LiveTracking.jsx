import { useDepot } from '../hooks/useDepot'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

export function LiveTracking() {
  const { buses, routes } = useDepot()

  // Simulate live tracking data by assigning stops
  const getBusLocation = (bus, route) => {
    const stops = route.stops
    const stopIndex = Math.floor(Math.random() * (stops.length - 1))
    return {
      currentStop: stops[stopIndex],
      nextStop: stops[stopIndex + 1] || stops[stopIndex],
      progress: Math.random() * 100,
    }
  }

  return (
    <div className="space-y-8">
      {/* Map View Simulation */}
      <Card className="p-8">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Live Bus Map</h3>
        <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 py-24">
          <div className="text-center">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="text-gray-600">
              Map simulation - Shows real-time bus locations
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {buses.filter((b) => b.status === 'running').length} buses active
            </p>
          </div>
        </div>
      </Card>

      {/* Live Tracking Details */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">Real-Time Tracking Details</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {buses
            .filter((b) => b.status === 'running')
            .map((bus) => {
              const route = routes.find((r) => r.id === bus.route)
              const location = getBusLocation(bus, route)

              return (
                <Card key={bus.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{bus.id}</p>
                        <p className="text-xs text-gray-600 mt-1">{route?.name}</p>
                      </div>
                      <Badge variant="success">Tracking</Badge>
                    </div>

                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Current Stop</p>
                        <p className="text-sm font-semibold text-gray-900">📍 {location.currentStop}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Next Stop</p>
                        <p className="text-sm font-semibold text-gray-900">🚩 {location.nextStop}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Progress to next stop</span>
                          <span className="font-semibold text-gray-900">{Math.round(location.progress)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-green-600 transition-all"
                            style={{ width: `${location.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Occupancy</span>
                          <span className="font-semibold text-gray-900">
                            {bus.passengerCount}/{bus.capacity}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${(bus.passengerCount / bus.capacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>👤 {bus.driverName}</span>
                        <span>•</span>
                        <span>⏰ {new Date(bus.lastUpdate).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>
      </div>

      {/* Route Map View */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">Route Maps</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {routes.map((route) => (
            <Card key={route.id} className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">{route.name}</h4>
              <div className="space-y-3">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {idx + 1}
                      </div>
                      {idx < route.stops.length - 1 && (
                        <div className="w-0.5 h-6 bg-blue-300" />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-medium text-gray-900">{stop}</p>
                      <p className="text-xs text-gray-500">
                        {idx === 0 ? 'Pick up point' : idx === route.stops.length - 1 ? 'Final destination' : 'Stop'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
