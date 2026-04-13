export function Button({ children, onClick, disabled = false, variant = 'primary', className = '', ...props }) {
  const baseClass = 'rounded-full font-semibold transition px-4 py-2 text-sm'

  const variants = {
    primary: 'bg-cb-brand text-white shadow-lg shadow-cb-brand/25 hover:bg-cb-brand-hover disabled:opacity-40',
    secondary:
      'border border-slate-200/90 bg-white/90 text-cb-text shadow-sm hover:border-slate-300 hover:bg-white disabled:opacity-40',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700 disabled:opacity-40',
    success: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-40',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
