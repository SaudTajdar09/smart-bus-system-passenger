import { useNavigate } from 'react-router-dom'
import { useDepot } from '../../hooks/useDepot'
import { useDepotAuth } from '../../hooks/useDepotAuth.js'

export function Header() {
  const navigate = useNavigate()
  const { stats } = useDepot()
  const { user, logout } = useDepotAuth()

  const handleResetData = () => {
    if (confirm('Clear all cached data and sync with ticket server?')) {
      localStorage.removeItem('depot_buses')
      localStorage.removeItem('depot_routes')
      localStorage.removeItem('depot_incidents')
      window.location.reload()
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="border-b border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Depot Management Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Real-time monitoring and control</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-900">{stats.activeBuses}</p>
            <p className="text-xs text-gray-600">Active Buses</p>
          </div>
          <div className="h-10 border-r border-gray-200" />
          <div className="text-center">
            <p className="font-semibold text-gray-900">{stats.totalPassengers}</p>
            <p className="text-xs text-gray-600">Passengers</p>
          </div>
          <div className="h-10 border-r border-gray-200" />
          <div className="text-center">
            <p className="font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Revenue Today</p>
          </div>
          <div className="h-10 border-r border-gray-200" />
          <button
            onClick={handleResetData}
            className="rounded-lg px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
          >
            🔄 Reset
          </button>
          <div className="h-10 border-r border-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
