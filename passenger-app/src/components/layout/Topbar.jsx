import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-[100] border-b border-white/40 bg-white/75 px-4 py-3.5 shadow-sm shadow-slate-900/[0.04] backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex max-w-lg items-center justify-between sm:max-w-xl md:max-w-2xl">
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-cb-text">CityBus</h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-cb-text-tertiary">Passenger</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100/90 px-3 py-1 text-[11px] font-semibold text-cb-text-secondary">
            {user?.name ? user.name.split(' ')[0] : 'Passenger'}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-cb-text shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
