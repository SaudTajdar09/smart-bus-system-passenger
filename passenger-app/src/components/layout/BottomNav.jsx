import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../hooks/useApp.js'

const items = [
  { to: '/', label: 'Home', icon: '??' },
  { to: '/book', label: 'Book', icon: '??' },
  { to: '/tickets', label: 'Tickets', icon: '???' },
  { to: '/track', label: 'Track', icon: '??' },
  { to: '/account', label: 'Account', icon: '??' },
]

export function BottomNav() {
  const location = useLocation()
  const { resetBooking } = useApp()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg justify-around rounded-2xl border border-white/50 bg-white/85 py-1.5 shadow-lg shadow-slate-900/[0.08] backdrop-blur-md supports-[backdrop-filter]:bg-white/75 sm:max-w-xl md:max-w-2xl">
        {items.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => {
              if (to === '/book' && location.pathname !== '/book') resetBooking()
            }}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-all ${
                isActive ? 'text-cb-brand' : 'text-cb-text-secondary hover:text-cb-text'
              }`
            }
          >
            <span className={`text-lg leading-none transition-transform ${location.pathname === to ? 'scale-110' : ''}`} aria-hidden>
              {icon}
            </span>
            <span className="max-w-full whitespace-normal px-0.5 text-center text-[8px] font-semibold uppercase leading-tight tracking-wide sm:text-[9px]">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
