import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { DemoNote } from '../components/common/DemoNote.jsx'

const ROLES = [
  { id: 'passenger', icon: '🧑', name: 'Passenger', enabled: true },
  { id: 'driver', icon: '🚌', name: 'Driver', enabled: false },
  { id: 'conductor', icon: '🎫', name: 'Conductor', enabled: false },
  { id: 'depot', icon: '🏢', name: 'Depot Manager', enabled: false },
]

const DEMO_EMAIL = {
  passenger: 'passenger@demo.com',
  driver: 'driver@demo.com',
  conductor: 'conductor@demo.com',
  depot: 'depot@demo.com',
}

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [role, setRole] = useState('passenger')

  function selectRole(id) {
    const r = ROLES.find((x) => x.id === id)
    if (!r?.enabled) return
    setRole(id)
  }

  function handleSignIn(e) {
    e.preventDefault()
    if (role !== 'passenger') return
    login()
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-[400px] rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl shadow-slate-900/[0.08] backdrop-blur-md">
        <div className="mb-1 text-3xl font-bold tracking-tight text-cb-text">CityBus</div>
        <p className="mb-6 text-sm text-cb-text-secondary">Smart transit for your city</p>

        <DemoNote>Demo — select Passenger to continue</DemoNote>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              disabled={!r.enabled}
              onClick={() => selectRole(r.id)}
              className={`rounded-2xl border py-3.5 text-center transition-all ${
                role === r.id && r.enabled
                  ? 'border-cb-brand bg-cb-brand-soft shadow-md shadow-cb-brand/10 ring-1 ring-cb-brand/20'
                  : 'border-slate-200/80 bg-slate-50/80 text-cb-text-secondary'
              } ${!r.enabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-cb-brand/40 hover:bg-white'}`}
            >
              <div className="mb-1 text-2xl">{r.icon}</div>
              <div className="text-xs font-semibold">{r.name}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner"
              type="email"
              value={DEMO_EMAIL[role]}
            />
          </div>
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary" htmlFor="login-pw">
              Password
            </label>
            <input
              id="login-pw"
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner"
              type="password"
              value="demo123"
            />
          </div>
          <button
            type="submit"
            disabled={role !== 'passenger'}
            className="w-full rounded-full bg-cb-brand py-3 text-sm font-semibold text-white shadow-lg shadow-cb-brand/25 transition hover:bg-cb-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
