import { Card } from '../ui/Card.jsx'
import { TicketInfo } from './TicketInfo.jsx'
import { QRCode } from './QRCode.jsx'

export function TicketCard({ ticket }) {
  if (!ticket) return null
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <TicketInfo ticket={ticket} />
        <QRCode value={ticket.qrPayload} />
      </div>
    </Card>
  )
}
