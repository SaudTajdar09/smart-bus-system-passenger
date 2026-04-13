export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/90 shadow-lg shadow-slate-900/[0.06] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
