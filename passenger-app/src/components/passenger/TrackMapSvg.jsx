import { useEffect, useState } from 'react'
import { BUSES, ROUTES, ROUTE_PATHS, ROUTE_COLORS, STOP_SETS, MAP_W, MAP_H } from '../../data/cityBusData.js'

function interpolateStops(stops, t) {
  if (!stops?.length) return { x: 0, y: 0 }
  const n = stops.length
  if (n === 1) return stops[0]
  const f = t * (n - 1)
  const seg = Math.min(Math.floor(f), n - 2)
  const frac = f - seg
  const s1 = stops[seg]
  const s2 = stops[seg + 1]
  return { x: s1.x + (s2.x - s1.x) * frac, y: s1.y + (s2.y - s1.y) * frac }
}

export function TrackMapSvg() {
  const [progress, setProgress] = useState(() =>
    Object.fromEntries(BUSES.map((b) => [b.id, 0.3 + Math.random() * 0.4])),
  )

  useEffect(() => {
    let frame
    const loop = () => {
      setProgress((prev) => {
        const next = { ...prev }
        BUSES.forEach((b) => {
          next[b.id] = ((next[b.id] ?? 0.5) + 0.001) % 1
        })
        return next
      })
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative h-[260px] overflow-hidden rounded-cb-md border border-cb-border bg-cb-muted">
      <svg className="h-full w-full" viewBox={`0 0 ${MAP_W} ${MAP_H}`} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect width={MAP_W} height={MAP_H} fill="var(--color-cb-muted)" />
        {ROUTE_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={ROUTE_COLORS[i]}
            strokeWidth="3"
            strokeDasharray="8 4"
            opacity="0.7"
          />
        ))}
        {STOP_SETS.flatMap((stops, ri) =>
          stops.map((s, si) => {
            const label = ROUTES[ri]?.stops?.[si]?.split(' ').slice(-1)[0] ?? ''
            return (
              <g key={`${ri}-${si}`}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={5}
                  fill="var(--color-cb-card)"
                  stroke={ROUTE_COLORS[ri]}
                  strokeWidth={2}
                />
                <text x={s.x} y={s.y - 10} textAnchor="middle" fontSize={9} fill="var(--color-cb-text-secondary)">
                  {label}
                </text>
              </g>
            )
          }),
        )}
        {BUSES.map((b, i) => {
          const pos = interpolateStops(STOP_SETS[i], progress[b.id] ?? 0.5)
          const color = ROUTE_COLORS[i] ?? '#1a56db'
          return (
            <g key={b.id}>
              <circle cx={pos.x} cy={pos.y} r={10} fill={color} className="cursor-pointer" />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={10} fill="white">
                🚌
              </text>
            </g>
          )
        })}
        <text x={10} y={395} fontSize={10} fill="var(--color-cb-text-tertiary)">
          Bengaluru Transit Network (simulated)
        </text>
      </svg>
    </div>
  )
}
