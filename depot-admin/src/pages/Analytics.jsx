import { useDepot } from '../hooks/useDepot'
import { Card } from '../components/ui/Card.jsx'
import { RevenueChart } from '../components/dashboard/RevenueChart.jsx'
import { PassengerChart } from '../components/dashboard/PassengerChart.jsx'

export function Analytics() {
  const { stats, buses, tickets, routes } = useDepot()

  const occupancyByBus = buses
    .map((bus) => ({
      busId: bus.id,
      route: bus.route,
      occupancy: Math.round((bus.passengerCount / bus.capacity) * 100),
      passengers: bus.passengerCount,
      capacity: bus.capacity,
    }))
    .sort((a, b) => b.occupancy - a.occupancy)

  const topRoutes = routes
    .map((route) => {
      const busCount = buses.filter((b) => b.route === route.id).length
      const passengers = buses.filter((b) => b.route === route.id).reduce((sum, b) => sum + b.passengerCount, 0)
      const tickets_ = tickets.filter((t) => t.route === route.id).length
      const revenue = tickets.filter((t) => t.route === route.id).reduce((sum, t) => sum + (t.fare || 0), 0)
      return { route: route.name, busCount, passengers, tickets: tickets_, revenue }
    })
    .sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <PassengerChart />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Avg Occupancy</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Tickets Sold</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{tickets.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Avg Fare</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ₹{tickets.length > 0 ? Math.round(stats.totalRevenue / tickets.length) : 0}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Active Routes</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{routes.length}</p>
        </Card>
      </div>

      {/* Occupancy by Bus */}
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Occupancy by Bus</h3>
        <div className="space-y-4">
          {occupancyByBus.map((data) => {
            const color = data.occupancy > 80 ? 'bg-red-600' : data.occupancy > 50 ? 'bg-yellow-600' : 'bg-green-600'
            return (
              <div key={data.busId}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {data.busId} - {data.route}
                  </span>
                  <span className="font-bold text-gray-900">
                    {data.passengers}/{data.capacity}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className={`h-full ${color} transition-all`} style={{ width: `${data.occupancy}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{data.occupancy}% full</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Top Routes */}
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Top Routes by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Buses</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Passengers</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Tickets</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topRoutes.map((data, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{data.route}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{data.busCount}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{data.passengers}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{data.tickets}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{data.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
