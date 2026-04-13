import { Card } from '../ui/Card.jsx'
import { useDepot } from '../../hooks/useDepot'

export function PassengerChart() {
  const { buses, routes } = useDepot()

  // Calculate passenger count per route
  const passengersByRoute = routes.map((route) => {
    const routeBuses = buses.filter((b) => b.route === route.id)
    const total = routeBuses.reduce((sum, b) => sum + b.passengerCount, 0)
    const capacity = routeBuses.reduce((sum, b) => sum + b.capacity, 0)
    return { name: route.name, total, capacity, busCount: routeBuses.length }
  })

  const maxPassengers = Math.max(...passengersByRoute.map((r) => r.total), 1)

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Passengers per Route</h3>
      <div className="space-y-4">
        {passengersByRoute.map((data) => (
          <div key={data.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{data.name}</span>
              <span className="font-bold text-gray-900">
                {data.total} / {data.capacity}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${(data.total / data.capacity) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{data.busCount} buses active</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
