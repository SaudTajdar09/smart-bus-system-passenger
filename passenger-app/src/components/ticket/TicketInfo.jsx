import { Badge } from '../ui/Badge.jsx'
import { formatTime } from '../../utils/helpers.js'

export function TicketInfo({ ticket }) {
  return (
    <div>
      <p className="mb-2 font-bold">
        {ticket.from} → {ticket.to}
      </p>
      <p className="mb-1 text-sm text-app-muted">
        Seat <strong className="text-app-fg">{ticket.seat}</strong>
      </p>
      <p className="mb-2 text-sm text-app-muted">Valid until {formatTime(ticket.validUntil)}</p>
      <Badge tone="success">Active</Badge>
    </div>
  )
}
