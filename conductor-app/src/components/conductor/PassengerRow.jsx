import { Card } from '../ui/Card.jsx'
import { StatusBadge } from './StatusBadge.jsx'
import { useConductor } from '../../hooks/useConductor.js'

export function PassengerRow({ passenger }) {
  const { scanTicket } = useConductor()

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="font-semibold text-cb-text">{passenger.name}</p>
            <span className="text-xs font-medium text-cb-text-secondary">Seat {passenger.seat}</span>
          </div>
          <p className="text-xs text-cb-text-tertiary">
            {passenger.from} → {passenger.to}
          </p>
          <p className="text-xs text-cb-text-secondary">ID: {passenger.id}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={passenger.status} />
          {passenger.status === 'booked' && (
            <button
              onClick={() => scanTicket(passenger.id)}
              className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Board
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
