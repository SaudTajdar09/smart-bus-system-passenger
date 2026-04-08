export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-app-elevated bg-app-surface px-4 py-8 text-center">
      <p className="mb-1.5 font-bold">{title}</p>
      {description ? <p className="mb-4 text-sm text-app-muted">{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </div>
  )
}
