const base = 'inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-semibold capitalize'

const tones = {
  neutral: 'bg-app-elevated text-app-muted',
  success: 'bg-app-success/20 text-app-success',
  warn: 'bg-app-warning/20 text-app-warning',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={`${base} ${tones[tone] ?? tones.neutral} ${className}`.trim()}>{children}</span>
}
