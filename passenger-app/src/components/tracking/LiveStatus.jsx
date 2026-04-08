import { Badge } from '../ui/Badge.jsx'
import { useSocket } from '../../hooks/useSocket.js'

export function LiveStatus() {
  const { connected } = useSocket()
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <span className="h-2 w-2 animate-pulse rounded-full bg-app-success" aria-hidden />
      <Badge tone={connected ? 'success' : 'neutral'}>{connected ? 'Live' : 'Offline'}</Badge>
      <span className="text-xs text-app-muted">{connected ? 'Receiving updates' : 'Using last known positions'}</span>
    </div>
  )
}
