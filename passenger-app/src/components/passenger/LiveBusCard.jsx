import { CityBadge } from '../ui/CityBadge.jsx'
import { ROUTES } from '../../data/cityBusData.js'

export function LiveBusCard({ bus }) {
  const route = ROUTES.find((r) => r.id === bus.route)
  const pct = Math.round((bus.occupancy / bus.capacity) * 100)
  const barColor = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#2563eb'

  return (
    <div className="mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg">🚌</span>
          <span className="text-sm font-semibold text-cb-text">{route?.name ?? bus.route}</span>
          <CityBadge variant={route?.type === 'student' ? 'blue' : 'green'}>
            {route?.type === 'student' ? 'Student' : 'Regular'}
          </CityBadge>
        </div>
        <CityBadge variant={bus.status === 'on-time' ? 'green' : 'amber'}>{bus.status}</CityBadge>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-cb-text-secondary">Next stop: {bus.nextStop}</span>
        <span className="inline-flex rounded-full bg-cb-brand-soft px-2.5 py-0.5 text-xs font-semibold text-cb-brand-text">
          ETA {bus.eta} min
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-cb-text-secondary">
        <span>Occupancy</span>
        <span>
          {bus.occupancy}/{bus.capacity}
        </span>
      </div>
    </div>
  )
}
