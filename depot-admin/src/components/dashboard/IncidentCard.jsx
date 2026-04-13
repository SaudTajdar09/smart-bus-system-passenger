import { Card } from '../ui/Card.jsx'
import { Badge } from '../ui/Badge.jsx'
import { Button } from '../ui/Button.jsx'

export function IncidentCard({ incident, onResolve }) {
  const typeIcon = {
    SOS: '🚨',
    Breakdown: '🔧',
    Complaint: '📢',
  }

  const statusVariant = incident.status === 'pending' ? 'warning' : 'success'
  const timeAgo = Math.floor((Date.now() - new Date(incident.timestamp).getTime()) / 60000)

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{typeIcon[incident.type] || '❓'}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{incident.type}</p>
              <p className="text-xs text-gray-600 mt-1">{incident.description}</p>
            </div>
          </div>
          <Badge variant={statusVariant}>{incident.status}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{incident.busId}</span>
          <span>{timeAgo} mins ago</span>
        </div>

        {incident.status === 'pending' && (
          <Button
            size="sm"
            variant="success"
            onClick={() => onResolve(incident.id)}
            className="w-full"
          >
            Mark as Resolved
          </Button>
        )}
      </div>
    </Card>
  )
}
