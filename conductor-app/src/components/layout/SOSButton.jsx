import { useNavigate, useLocation } from 'react-router-dom'

export function SOSButton() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Don't show SOS button on login or emergency pages
  if (location.pathname === '/login' || location.pathname === '/emergency') {
    return null
  }

  return (
    <button
      onClick={() => navigate('/emergency')}
      className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full bg-red-600 shadow-2xl hover:bg-red-700 text-white text-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse"
      title="Emergency SOS - Tap to contact authorities"
      aria-label="Emergency SOS button"
    >
      🆘
    </button>
  )
}
