import { useDepot } from '../hooks/useDepot'
import { StatCard } from '../components/ui/StatCard.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { RevenueChart } from '../components/dashboard/RevenueChart.jsx'
import { PassengerChart } from '../components/dashboard/PassengerChart.jsx'
import { AlertNotificationBox } from '../components/alerts/AlertNotificationBox.jsx'

export function Dashboard() {
  const { stats, buses, tickets } = useDepot()

  const recentActivity = tickets.slice(-5).reverse()

  return (
    <div className="space-y-8">
      <AlertNotificationBox />
      
      {/* Key Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Buses" value={stats.activeBuses} />
        <StatCard title="Total Passengers" value={stats.totalPassengers} />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <PassengerChart />
      </div>

      {/* Bus Status Overview */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Bus Status Overview</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.activeBuses}</p>
            <p className="text-sm text-green-700">Running</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{buses.filter((b) => b.status === 'idle').length}</p>
            <p className="text-sm text-yellow-700">Idle</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{buses.filter((b) => b.status === 'maintenance').length}</p>
            <p className="text-sm text-red-700">Maintenance</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ticket #{activity.id.substring(0, 8)}</p>
                  <p className="text-xs text-gray-600">
                    {activity.from} → {activity.to}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === 'booked' ? 'info' : activity.status === 'boarded' ? 'success' : 'default'}>
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">₹{activity.fare}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  )
}
