import { useEffect, useState } from 'react'

export function PopupNotification({ title, message, type = 'success', duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor =
    type === 'success'
      ? 'bg-gradient-to-r from-emerald-500 to-green-600'
      : type === 'error'
        ? 'bg-gradient-to-r from-red-500 to-red-600'
        : 'bg-gradient-to-r from-orange-500 to-yellow-600'

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex items-start justify-center pt-4">
      <div
        className={`${bgColor} rounded-2xl px-6 py-4 text-white shadow-2xl animate-bounce max-w-md`}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{iconMap[type]}</span>
          <div>
            {title && <div className="font-bold text-lg">{title}</div>}
            {message && <div className="text-sm opacity-95">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
