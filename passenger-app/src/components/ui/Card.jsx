const cardBase =
  'rounded-xl border border-app-elevated bg-app-surface p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)]'

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`${cardBase} ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
