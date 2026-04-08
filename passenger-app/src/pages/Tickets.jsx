import { useState } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { TicketListCard } from '../components/passenger/TicketListCard.jsx'
import { ROUTES, PASSES } from '../data/cityBusData.js'
import { useTicketsPartitioned } from '../hooks/useTickets.js'

export function Tickets() {
  const { active, history } = useTicketsPartitioned()
  const [openHistoryId, setOpenHistoryId] = useState(null)

  function routeName(routeId) {
    return ROUTES.find((r) => r.id === routeId)?.name ?? routeId
  }

  return (
    <>
      <SectionTitle>My tickets</SectionTitle>

      {active.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-cb-text-secondary">Active ticket</h3>
          {active.map((t) => (
            <TicketListCard key={t.id} ticket={t} routeName={routeName(t.route)} />
          ))}
        </div>
      ) : null}

      {history.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-cb-text-secondary">Previous tickets</h3>
          {history.map((t) => (
            <TicketListCard
              key={t.id}
              ticket={t}
              routeName={routeName(t.route)}
              detailsOpen={openHistoryId === t.id}
              onViewDetails={() => setOpenHistoryId((prev) => (prev === t.id ? null : t.id))}
            />
          ))}
        </div>
      ) : null}

      {active.length === 0 && history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white/60 py-8 text-center text-sm text-cb-text-secondary">
          No tickets yet. Book a trip to see them here.
        </p>
      ) : null}

      <div className="mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm">
        <div className="mb-3 text-sm font-semibold text-cb-text">Student passes</div>
        {PASSES.slice(0, 1).map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 text-white shadow-inner"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            <div className="text-[15px] font-medium">{p.name}</div>
            <div className="text-[11px] opacity-80">
              {p.type} — {p.college}
            </div>
            <div className="mt-3 flex justify-between text-[11px] opacity-60">
              <span>Valid till {p.valid}</span>
              <span>{p.id}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
