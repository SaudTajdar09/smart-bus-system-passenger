import { Badge } from '../ui/Badge.jsx'

export function StatusBadge({ status }) {
  if (status === 'boarded' || status === 'expired') {
    return <Badge variant="success">✓ Boarded</Badge>
  }
  return <Badge variant="warning">⏳ Boarding</Badge>
}
