export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex justify-center gap-1.5 py-8" role="status" aria-live="polite">
      <span className="h-2 w-2 animate-bounce rounded-full bg-app-primary [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-app-primary [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-app-primary [animation-delay:300ms]" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
