export function Input({ label, id, className = '', ...props }) {
  const inputId = id ?? props.name
  return (
    <label className={`mb-3 flex flex-col gap-1.5 last:mb-0 ${className}`.trim()} htmlFor={inputId}>
      {label ? <span className="text-xs text-app-muted">{label}</span> : null}
      <input
        className="rounded-lg border border-app-elevated bg-app-bg px-2.5 py-2 text-sm text-app-fg outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-0 focus:ring-offset-app-bg"
        id={inputId}
        {...props}
      />
    </label>
  )
}
