const styles = {
  green: 'bg-cb-green-bg text-cb-green-text',
  blue: 'bg-cb-brand-soft text-cb-brand-text',
  amber: 'bg-cb-amber-bg text-cb-amber-text',
  red: 'bg-cb-red-bg text-cb-red-text',
  purple: 'bg-cb-purple-bg text-cb-purple-text',
}

export function CityBadge({ children, variant = 'green', className = '' }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[variant] ?? styles.green} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
