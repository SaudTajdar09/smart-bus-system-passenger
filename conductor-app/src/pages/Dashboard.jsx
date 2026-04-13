import { Card } from '../components/ui/Card.jsx'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { useConductor } from '../hooks/useConductor.js'
import { CURRENT_CONDUCTOR } from '../data/conductorData.js'
import { RouteCard } from '../components/conductor/RouteCard.jsx'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const navigate = useNavigate()
  const { boardedCount, totalCapacity, route, passengers } = useConductor()

  const occupancyPercent = Math.round((boardedCount / totalCapacity) * 100)
  const remainingCapacity = totalCapacity - boardedCount

  const bookedCount = passengers.filter((p) => p.status === 'booked').length

  return (
    <>
      <SectionTitle>Dashboard</SectionTitle>

      {/* Conductor Info */}
      <Card className="mb-6 p-5">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-cb-text-secondary">Conductor</p>
            <p className="text-sm font-bold text-cb-text">{CURRENT_CONDUCTOR.name}</p>
            <p className="text-xs text-cb-text-tertiary">{CURRENT_CONDUCTOR.badge}</p>
          </div>
          <div>
            <p className="text-xs text-cb-text-secondary">Shift</p>
            <p className="text-sm font-bold text-cb-text">{CURRENT_CONDUCTOR.shift}</p>
            <p className="text-xs text-cb-text-tertiary">In Progress</p>
          </div>
        </div>
      </Card>

      {/* Occupancy Stats */}
      <Card className="mb-6 p-5">
        <p className="mb-3 text-xs font-semibold text-cb-text-secondary">Bus Occupancy</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-8 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${occupancyPercent}%` }}
            >
              {occupancyPercent > 20 && `${occupancyPercent}%`}
            </div>
          </div>
          {occupancyPercent <= 20 && <div className="text-right text-xs font-bold text-blue-600">{occupancyPercent}%</div>}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{boardedCount}</p>
            <p className="text-xs text-cb-text-secondary">Boarded</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{bookedCount}</p>
            <p className="text-xs text-cb-text-secondary">Boarding</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{remainingCapacity}</p>
            <p className="text-xs text-cb-text-secondary">Empty</p>
          </div>
        </div>
      </Card>

      {/* Route Card */}
      <RouteCard route={route} />

      {/* Quick Actions */}
      <Card className="p-5">
        <p className="mb-3 text-xs font-semibold text-cb-text-secondary">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => navigate('/scanner')}
            className="rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            🔍 Scan Ticket
          </button>
          <button 
            onClick={() => navigate('/passengers')}
            className="rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-cb-text hover:bg-slate-50 transition"
          >
            👥 Passengers
          </button>
          <button 
            onClick={() => navigate('/manual-ticket')}
            className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            🎫 Issue Ticket
          </button>
          <button 
            onClick={() => navigate('/emergency')}
            className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            🆘 Emergency
          </button>
        </div>
      </Card>
    </>
  )
}
