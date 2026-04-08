export function MapView({ buses = [] }) {
  return (
    <div className="mb-4" role="region" aria-label="Map preview">
      <div className="relative h-[200px] overflow-hidden rounded-xl border border-app-elevated bg-gradient-to-br from-app-elevated to-app-surface">
        {buses.length === 0 ? (
          <p className="m-0 p-8 text-center text-sm text-app-muted">No live vehicles in view</p>
        ) : (
          buses.map((b) => (
            <span
              key={b.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-app-primary px-1.5 py-0.5 text-[0.65rem] font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              title={b.number}
              style={{ left: `${30 + (b.id.length % 5) * 12}%`, top: `${25 + (b.number.length % 4) * 15}%` }}
            >
              {b.number}
            </span>
          ))
        )}
      </div>
      <p className="mt-2 text-xs text-app-muted">Connect a maps SDK (Mapbox, Google Maps, Leaflet) here.</p>
    </div>
  )
}
