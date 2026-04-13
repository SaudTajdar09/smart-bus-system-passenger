import { useConductor } from '../../hooks/useConductor.js'
import { Card } from '../ui/Card.jsx'
import { PassengerRow } from './PassengerRow.jsx'

export function PassengerList() {
  const { passengers } = useConductor()

  if (passengers.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-cb-text-secondary">No passengers for this route</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {passengers.map((passenger) => (
        <PassengerRow key={passenger.id} passenger={passenger} />
      ))}
    </div>
  )
}
