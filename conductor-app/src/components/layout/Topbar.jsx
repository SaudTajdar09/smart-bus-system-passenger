import { useConductor } from '../../hooks/useConductor.js'
import { CURRENT_CONDUCTOR } from '../../data/conductorData.js'

export function Topbar() {
  const { boardedCount, totalCapacity } = useConductor()

  const occupancyPercent = Math.round((boardedCount / totalCapacity) * 100)

  return (
    <div className="sticky top-0 z-10 border-b border-white/20 bg-white/95 backdrop-blur-md supports-backdrop-filter:bg-white/75">
      <div className="mx-auto w-full max-w-lg px-4 py-3 sm:max-w-xl md:max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-cb-text-secondary">Conductor Badge</div>
            <div className="text-sm font-semibold text-cb-text">{CURRENT_CONDUCTOR.name}</div>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-cb-text-secondary">Occupancy</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-cb-brand">{boardedCount}</span>
              <span className="text-xs text-cb-text-secondary">/ {totalCapacity}</span>
              <span className="ml-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {occupancyPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
