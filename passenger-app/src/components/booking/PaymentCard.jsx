import { Card } from '../ui/Card.jsx'
import { Input } from '../ui/Input.jsx'
import { Button } from '../ui/Button.jsx'
import { formatCurrency } from '../../utils/helpers.js'

export function PaymentCard({ amount, onPay }) {
  return (
    <Card>
      <p className="mb-4 text-base">
        Total <strong>{formatCurrency(amount)}</strong>
      </p>
      <Input label="Name on card" name="cardName" autoComplete="cc-name" placeholder="Alex Rider" />
      <Input label="Card number" name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Expiry" name="exp" placeholder="MM/YY" />
        <Input label="CVC" name="cvc" inputMode="numeric" placeholder="123" />
      </div>
      <Button className="mt-2 w-full" onClick={onPay}>
        Pay now
      </Button>
    </Card>
  )
}
