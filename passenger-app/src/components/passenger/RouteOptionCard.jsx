import { CityBadge } from '../ui/CityBadge.jsx'
import { formatInr } from '../../utils/helpers.js'

export function RouteOptionCard({ route, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(route)}
      className="group mb-1 w-full rounded-2xl border border-white/60 bg-white/90 p-4 text-left shadow-md shadow-slate-900/[0.05] backdrop-blur-sm transition-all hover:border-cb-brand/25 hover:shadow-lg hover:shadow-cb-brand/10"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cb-brand-soft to-slate-50 text-xl shadow-inner">
            🚌
          </span>
          <span className="text-sm font-semibold tracking-tight text-cb-text">{route.name}</span>
        </div>
        <CityBadge variant={route.type === 'student' ? 'blue' : 'green'}>{route.type === 'student' ? 'Student' : 'Regular'}</CityBadge>
      </div>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-cb-text-secondary">{route.stops.join(' → ')}</p>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="text-cb-text-secondary">First bus · {route.times[0]}</span>
        <span className="font-bold text-cb-brand">from {formatInr(route.fare)}</span>
      </div>
    </button>
  )
}
