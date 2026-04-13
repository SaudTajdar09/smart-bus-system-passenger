import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '📊 Dashboard' },
  { path: '/analytics', label: '📈 Analytics' },
  { path: '/fleet', label: '🚌 Fleet' },
  { path: '/tracking', label: '🗺️ Tracking' },
  { path: '/incidents', label: '⚠️ Incidents' },
  { path: '/routes', label: '🛣️ Routes' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="h-screen w-64 flex-col border-r border-gray-200 bg-white p-6 hidden md:flex">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">SmartGovBus</h1>
        <p className="text-xs text-gray-500">Depot Management Dashboard</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
              location.pathname === item.path
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">Admin Panel</p>
        <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
      </div>
    </div>
  )
}
