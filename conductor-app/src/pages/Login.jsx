import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DemoNote } from '../components/common/DemoNote'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('conductor@demo.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate login delay
    setTimeout(() => {
      if (email && password) {
        // Store conductor session
        localStorage.setItem('conductorAuth', JSON.stringify({
          id: 'COND-001',
          email,
          authenticated: true,
          loginTime: new Date().toISOString(),
        }))
        setLoading(false)
        navigate('/', { replace: true })
      } else {
        setError('Please fill in all fields')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[420px] rounded-3xl border border-white/60 bg-white/95 p-8 shadow-2xl shadow-slate-900/[0.15] backdrop-blur-md">
        {/* Header */}
        <div className="mb-2">
          <div className="mb-1 text-3xl font-bold tracking-tight text-cb-text flex items-center gap-2">
            <span>🚌</span> CityBus
          </div>
          <p className="text-sm text-cb-text-secondary">Conductor Portal</p>
        </div>

        <DemoNote>Demo Account: Use the credentials below to sign in</DemoNote>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary"
              htmlFor="conductor-email"
            >
              Conductor Email
            </label>
            <input
              id="conductor-email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-1 focus:ring-cb-brand/30 transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="conductor@demo.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary"
              htmlFor="conductor-password"
            >
              Password
            </label>
            <input
              id="conductor-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-1 focus:ring-cb-brand/30 transition"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cb-brand hover:bg-blue-700 text-white font-semibold py-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-cb-brand/20 hover:shadow-lg hover:shadow-cb-brand/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Signing in...
              </span>
            ) : (
              '🔐 Sign In'
            )}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 rounded-2xl bg-blue-50 p-4 border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">📋 Demo Information</p>
          <div className="space-y-1 text-xs text-blue-800">
            <p>
              <strong>Email:</strong>{' '}
              <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">conductor@demo.com</code>
            </p>
            <p>
              <strong>Password:</strong>{' '}
              <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">password123</code>
            </p>
            <p className="mt-2 text-blue-700/80">✓ No backend required for demo</p>
            <p className="text-blue-700/80">✓ Data persists in localStorage</p>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-6 flex gap-3 text-xs">
          <div className="flex-1">
            <p className="font-semibold text-cb-brand mb-1">🔍 Scanner</p>
            <p className="text-cb-text-secondary text-[11px]">Scan & verify tickets</p>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-cb-brand mb-1">👥 Passengers</p>
            <p className="text-cb-text-secondary text-[11px]">Manage boarding</p>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-cb-brand mb-1">📊 Dashboard</p>
            <p className="text-cb-text-secondary text-[11px]">Track metrics</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-cb-text-secondary">
          <p>CityBus Conductor System</p>
          <p className="text-[10px] mt-1">v1.0.0 | Demo Mode</p>
        </div>
      </div>
    </div>
  )
}
