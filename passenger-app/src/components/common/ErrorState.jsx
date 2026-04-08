import { Button } from '../ui/Button.jsx'

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-dashed border-app-elevated bg-app-surface px-4 py-8 text-center" role="alert">
      <p className="mb-1.5 font-bold">Something went wrong</p>
      <p className="mb-4 text-sm text-app-muted">{message}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
