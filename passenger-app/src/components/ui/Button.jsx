const base =
  'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45'

const variants = {
  primary: 'bg-app-primary text-white hover:bg-app-primary-hover',
  ghost: 'border border-app-elevated bg-transparent text-app-primary hover:bg-app-elevated hover:text-app-fg',
  danger: 'bg-app-danger text-white hover:opacity-90',
}

export function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  return (
    <button type="button" className={`${base} ${variants[variant] ?? variants.primary} ${className}`.trim()} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
