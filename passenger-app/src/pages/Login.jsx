import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { DemoNote } from '../components/common/DemoNote.jsx'

export function Login() {
  const { loginWithCredentials, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup form state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [signupPhone, setSignupPhone] = useState('')

  const demoUsers = [
    { name: 'Arjun Mehta', email: 'arjun@demo.com', password: 'password123', phone: '+91 90000 12345' },
    { name: 'Priya Singh', email: 'priya@demo.com', password: 'password123', phone: '+91 90001 12345' },
    { name: 'Raj Patel', email: 'raj@demo.com', password: 'password123', phone: '+91 90002 12345' },
  ]

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!loginEmail || !loginPassword) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    const result = loginWithCredentials(loginEmail, loginPassword)
    if (result.success) {
      setSuccess(`✅ Welcome back, ${result.user.name}!`)
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1500)
    } else {
      setError(result.error || 'Login failed')
      setLoading(false)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Validation
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const result = register(signupEmail, signupPassword, signupName, signupPhone)
    if (result.success) {
      setSuccess(`✅ Account created! Welcome, ${result.user.name}!`)
      // Clear form
      setSignupName('')
      setSignupEmail('')
      setSignupPassword('')
      setSignupConfirmPassword('')
      setSignupPhone('')
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1500)
    } else {
      setError(result.error || 'Signup failed')
      setLoading(false)
    }
  }

  function fillDemoUser(user) {
    setLoginEmail(user.email)
    setLoginPassword(user.password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-[420px] rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl shadow-slate-900/[0.08] backdrop-blur-md">
        <div className="mb-1 text-3xl font-bold tracking-tight text-cb-text">CityBus</div>
        <p className="mb-6 text-sm text-cb-text-secondary">Smart transit for your city</p>

        {/* Mode Toggle */}
        <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1">
          <button
            onClick={() => {
              setMode('login')
              setError(null)
              setSuccess(null)
            }}
            className={`flex-1 rounded-full py-2 px-4 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-cb-brand text-white shadow-lg shadow-cb-brand/25'
                : 'text-cb-text-secondary hover:text-cb-text'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup')
              setError(null)
              setSuccess(null)
            }}
            className={`flex-1 rounded-full py-2 px-4 text-sm font-semibold transition ${
              mode === 'signup'
                ? 'bg-cb-brand text-white shadow-lg shadow-cb-brand/25'
                : 'text-cb-text-secondary hover:text-cb-text'
            }`}
          >
            Create Account
          </button>
        </div>

        <DemoNote>Demo — Try arjun@demo.com / password123 or create a new account</DemoNote>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cb-brand py-3 text-sm font-semibold text-white shadow-lg shadow-cb-brand/25 transition hover:bg-cb-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo Users Section */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="mb-3 text-xs font-semibold uppercase text-cb-text-secondary">Quick Demo Login:</p>
              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => fillDemoUser(user)}
                    className="w-full rounded-lg bg-slate-50 p-3 text-left text-xs hover:bg-slate-100 transition border border-slate-200"
                  >
                    <div className="font-semibold text-cb-text">{user.name}</div>
                    <div className="text-cb-text-secondary">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* SIGNUP MODE */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Full Name
              </label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Arjun Mehta"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Email Address
              </label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                placeholder="+91 90000 12345"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Password (Min 6 characters)
              </label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
                Confirm Password
              </label>
              <input
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text shadow-inner focus:border-cb-brand focus:outline-none focus:ring-2 focus:ring-cb-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cb-brand py-3 text-sm font-semibold text-white shadow-lg shadow-cb-brand/25 transition hover:bg-cb-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

