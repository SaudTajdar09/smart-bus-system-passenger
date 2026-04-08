import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'
import { CityBadge } from '../components/ui/CityBadge.jsx'
import { USER, BUSES, ROUTES } from '../data/cityBusData.js'
import { useAuth } from '../hooks/useAuth.js'
import { useTicketsPartitioned } from '../hooks/useTickets.js'
import { passengerSeatSummary } from '../utils/ticketDisplay.js'

const card =
  'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'

export function Home() {
  const { user } = useAuth()
  const { active } = useTicketsPartitioned()
  const activeTicket = active[0]

  const bus = BUSES[0]
  const route = ROUTES.find((r) => r.id === bus.route)
  const pct = Math.round((bus.occupancy / bus.capacity) * 100)
  const dash = `${(bus.occupancy / bus.capacity) * 201} 201`
  const seatSummary = activeTicket ? passengerSeatSummary(activeTicket) : null

  return (
    <>
      <SectionTitle>
        Good morning, {user?.name?.split(' ')[0] ?? 'there'} 👋
      </SectionTitle>
      <DemoNote />

      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-cb-text">Your active ticket</span>
          {activeTicket ? <CityBadge variant="green">Active</CityBadge> : <CityBadge variant="amber">None</CityBadge>}
        </div>
        {activeTicket ? (
          <>
            <div className="mb-3 flex justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-cb-text-secondary">Route</div>
                <div className="text-sm font-semibold text-cb-text">
                  {ROUTES.find((r) => r.id === activeTicket.route)?.name ?? activeTicket.route}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-medium uppercase tracking-wide text-cb-text-secondary">Passengers</div>
                <div className="text-sm font-semibold text-cb-text">{seatSummary?.count ?? 1}</div>
              </div>
            </div>
            <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-cb-text-secondary">
              {seatSummary?.line}
            </div>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-cb-text-secondary">From</div>
                <div className="text-[13px] font-medium text-cb-text">{activeTicket.from}</div>
              </div>
              <span className="text-cb-text-tertiary">→</span>
              <div className="text-right">
                <div className="text-[11px] font-medium uppercase tracking-wide text-cb-text-secondary">To</div>
                <div className="text-[13px] font-medium text-cb-text">{activeTicket.to}</div>
              </div>
            </div>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="inline-flex rounded-full bg-cb-brand-soft px-3 py-1.5 text-xs font-semibold text-cb-brand-text">
              Bus ETA: {bus.eta} mins · Next: {bus.nextStop}
            </div>
          </>
        ) : (
          <p className="text-sm text-cb-text-secondary">No active ticket — book a seat to travel.</p>
        )}
      </div>

      <div className={card}>
        <div className="mb-4 text-sm font-semibold text-cb-text">Live occupancy — {route?.name ?? 'Route'}</div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[28px] font-bold tracking-tight text-cb-text">
              {bus.occupancy}
              <span className="text-base font-semibold text-cb-text-secondary">/{bus.capacity}</span>
            </div>
            <div className="text-xs text-cb-text-secondary">passengers on board</div>
          </div>
          <svg className="h-20 w-20 shrink-0" viewBox="0 0 80 80" aria-hidden>
            <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#2563eb"
              strokeWidth="8"
              strokeDasharray={dash}
              strokeDashoffset="50"
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="600" fill="#2563eb">
              {pct}%
            </text>
          </svg>
        </div>
      </div>

      <div className={card}>
        <div className="mb-3 text-sm font-semibold text-cb-text">Your student pass</div>
        <div
          className="rounded-2xl p-5 text-white shadow-inner"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #1e40af 100%)' }}
        >
          <div className="text-sm font-semibold">{USER.name}</div>
          <div className="text-[11px] opacity-90">Monthly Student Pass — {USER.college}</div>
          <div className="mt-3 text-[11px] opacity-75">Valid till 30 Apr 2026 · PASS-2026-0441</div>
        </div>
      </div>
    </>
  )
}
