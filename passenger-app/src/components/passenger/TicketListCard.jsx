import { CityBadge } from '../ui/CityBadge.jsx'
import { QRTicketBlock } from './QRTicketBlock.jsx'
import { passengerSeatSummary } from '../../utils/ticketDisplay.js'
import { formatDateTime } from '../../utils/ticketTime.js'
import { formatInr } from '../../utils/helpers.js'

export function TicketListCard({ ticket, routeName, onViewDetails, detailsOpen = false }) {
  const { line } = passengerSeatSummary(ticket)
  const isActive = ticket.status === 'active'

  return (
    <div className="mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-cb-text">{routeName}</span>
        <CityBadge variant={isActive ? 'green' : 'amber'}>{ticket.status}</CityBadge>
      </div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-cb-text-secondary">From</div>
          <div className="text-[13px] font-medium text-cb-text">{ticket.from}</div>
        </div>
        <span className="text-cb-text-tertiary">-&gt;</span>
        <div className="text-right">
          <div className="text-[11px] font-medium uppercase tracking-wide text-cb-text-secondary">To</div>
          <div className="text-[13px] font-medium text-cb-text">{ticket.to}</div>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm text-cb-text-secondary">
        <span>
          {ticket.date} · {ticket.time}
        </span>
        <span className="font-medium text-cb-text">{line}</span>
      </div>
      {isActive ? (
        <QRTicketBlock
          id={ticket.id}
          routeName={routeName}
          seat={ticket.seat}
          seats={ticket.seats}
          date={ticket.date}
          time={ticket.time}
          from={ticket.from}
          to={ticket.to}
          expiresAt={ticket.expiresAt}
        />
      ) : (
        <>
          <div className="rounded-xl bg-slate-100/90 py-3 text-center text-[13px] text-cb-text-secondary">
            Ticket used — journey completed
          </div>
          <button
            type="button"
            onClick={onViewDetails}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium text-cb-text transition hover:bg-slate-50"
          >
            {detailsOpen ? 'Hide details' : 'View details'}
          </button>
          {detailsOpen ? (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-cb-text-secondary">
              <p>
                <span className="font-semibold text-cb-text">Ticket ID:</span> {ticket.id}
              </p>
              <p>
                <span className="font-semibold text-cb-text">Booked:</span> {formatDateTime(ticket.bookedAt)}
              </p>
              <p>
                <span className="font-semibold text-cb-text">Expired:</span> {ticket.expiresAt ? formatDateTime(ticket.expiresAt) : '—'}
              </p>
              <p>
                <span className="font-semibold text-cb-text">Fare:</span> {formatInr(ticket.fare)}
              </p>
              <p>
                <span className="font-semibold text-cb-text">Passengers:</span> {line}
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
