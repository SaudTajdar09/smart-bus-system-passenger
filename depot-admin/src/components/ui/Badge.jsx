export function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
    info: 'bg-blue-200 text-blue-800',
  }

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
