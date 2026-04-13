import { Card } from '../ui/Card.jsx'
import { useDepot } from '../../hooks/useDepot'

export function RevenueChart() {
  const { tickets, routes } = useDepot()

  // Calculate revenue per route
  const revenueByRoute = routes.map((route) => {
    const routeTickets = tickets.filter((t) => t.route === route.id)
    const revenue = routeTickets.reduce((sum, t) => sum + (t.fare || 0), 0)
    return { name: route.name, revenue, ticketCount: routeTickets.length }
  })

  const maxRevenue = Math.max(...revenueByRoute.map((r) => r.revenue), 1)

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Revenue per Route</h3>
      <div className="space-y-4">
        {revenueByRoute.map((data) => (
          <div key={data.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{data.name}</span>
              <span className="font-bold text-gray-900">₹{data.revenue.toLocaleString()}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{data.ticketCount} tickets</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
