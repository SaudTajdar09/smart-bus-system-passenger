import { useDepot } from '../hooks/useDepot'
import { RouteCard } from '../components/dashboard/RouteCard.jsx'
import { Card } from '../components/ui/Card.jsx'

export function Routes() {
  const { routes, buses, tickets } = useDepot()

  // Calculate detailed route statistics
  const routeStats = routes.map((route) => {
    const routeBuses = buses.filter((b) => b.route === route.id)
    const routeTickets = tickets.filter((t) => t.route === route.id)
    const totalPassengers = routeBuses.reduce((sum, b) => sum + b.passengerCount, 0)
    const totalCapacity = routeBuses.reduce((sum, b) => sum + b.capacity, 0)
    const revenue = routeTickets.reduce((sum, t) => sum + (t.fare || 0), 0)

    return {
      ...route,
      buses: routeBuses,
      buseCount: routeBuses.length,
      totalPassengers,
      totalCapacity,
      occupancyRate: totalCapacity > 0 ? Math.round((totalPassengers / totalCapacity) * 100) : 0,
      ticketsSold: routeTickets.length,
      revenue,
    }
  })

  return (
    <div className="space-y-8">
      {/* Route Cards Grid */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">All Routes</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routeStats.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>

      {/* Route Details Table */}
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Route Operations Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Buses</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Passengers</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Capacity</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Occupancy</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Tickets</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {routeStats.map((route) => (
                <tr key={route.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{route.name}</p>
                      <p className="text-xs text-gray-500">{route.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-900">{route.buseCount}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{route.totalPassengers}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{route.totalCapacity}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            route.occupancyRate > 80
                              ? 'bg-red-600'
                              : route.occupancyRate > 50
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                          }`}
                          style={{ width: `${route.occupancyRate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 text-xs">{route.occupancyRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{route.ticketsSold}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{route.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Route Details */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">Route Details & Stops</h3>
        <div className="grid grid-cols-1 gap-6">
          {routeStats.map((route) => (
            <Card key={route.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{route.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">Distance: {route.distance} km</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₹{route.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{route.ticketsSold} tickets sold</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Stops</h5>
                  <div className="space-y-2">
                    {route.stops.map((stop, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={`h-3 w-3 rounded-full ${idx === 0 ? 'bg-green-600' : idx === route.stops.length - 1 ? 'bg-red-600' : 'bg-blue-600'}`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{stop}</p>
                          <p className="text-xs text-gray-500">
                            {idx === 0 ? '(Start)' : idx === route.stops.length - 1 ? '(End)' : `(Stop ${idx})`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Assigned Buses</h5>
                  <div className="flex flex-wrap gap-2">
                    {route.buses.map((bus) => (
                      <div
                        key={bus.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                      >
                        <span className="font-semibold text-gray-900">{bus.id}</span>
                        <span className="text-xs text-gray-600">
                          ({bus.passengerCount}/{bus.capacity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
