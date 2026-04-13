import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { RouteCard } from '../components/conductor/RouteCard.jsx'
import { useConductor } from '../hooks/useConductor.js'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { CONDUCTOR_ROUTES } from '../data/conductorData.js'

export function Route() {
  const { route, currentRoute, changeRoute, currentStop, setCurrentStop } = useConductor()

  return (
    <>
      <SectionTitle>Route Details</SectionTitle>

      {/* Current Route */}
      <RouteCard route={route} />

      {/* Route Selection */}
      <Card className="mb-6 p-5">
        <p className="mb-3 text-xs font-semibold text-cb-text-secondary">Switch Route</p>
        <div className="space-y-2">
          {CONDUCTOR_ROUTES.map((r) => (
            <button
              key={r.id}
              onClick={() => changeRoute(r.id)}
              className={`w-full rounded-lg p-3 text-left transition ${
                currentRoute === r.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-cb-text">{r.name}</p>
                  <p className="text-xs text-cb-text-secondary">{r.stops.length} stops • {r.type}</p>
                </div>
                {currentRoute === r.id && <span className="text-lg">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Current Stop */}
      <Card className="p-5">
        <p className="mb-3 text-xs font-semibold text-cb-text-secondary">Current Stop</p>
        <div className="mb-3 rounded-lg bg-blue-50 p-3">
          <p className="text-lg font-bold text-blue-600">{currentStop}</p>
          <p className="text-xs text-blue-700">Current location</p>
        </div>

        <p className="mb-2 text-xs font-semibold text-cb-text-secondary">Next Stops</p>
        <div className="space-y-1">
          {route?.stops
            .slice(
              route.stops.indexOf(currentStop) + 1,
              route.stops.indexOf(currentStop) + 4,
            )
            .map((stop, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-cb-text">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                  {route.stops.indexOf(currentStop) + idx + 2}
                </span>
                {stop}
              </div>
            ))}
        </div>
      </Card>
    </>
  )
}
