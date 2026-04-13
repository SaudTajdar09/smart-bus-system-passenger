import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { PassengerList } from '../components/conductor/PassengerList.jsx'
import { useConductor } from '../hooks/useConductor.js'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

export function Passengers() {
  const { passengers, boardedCount, totalCapacity } = useConductor()

  const bookedCount = passengers.filter((p) => p.status === 'booked').length

  return (
    <>
      <SectionTitle>Passengers</SectionTitle>

      {/* Summary Stats */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-cb-text-secondary">Total</p>
            <p className="text-2xl font-bold text-cb-text">{passengers.length}</p>
          </div>
          <div>
            <p className="text-xs text-cb-text-secondary">Boarded</p>
            <p className="text-2xl font-bold text-emerald-600">{boardedCount}</p>
          </div>
          <div>
            <p className="text-xs text-cb-text-secondary">Boarding</p>
            <p className="text-2xl font-bold text-orange-600">{bookedCount}</p>
          </div>
        </div>
      </Card>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        <Badge variant="info">All ({passengers.length})</Badge>
        <Badge variant="success">Boarded ({boardedCount})</Badge>
        <Badge variant="warning">Pending ({bookedCount})</Badge>
      </div>

      {/* Passengers List */}
      <PassengerList />
    </>
  )
}
