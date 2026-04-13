import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDepotAuth } from '../hooks/useDepotAuth.js'

export function Login() {
  const navigate = useNavigate()
  const { login } = useDepotAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validate input
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Attempt login
    const result = login(formData.email, formData.password)

    if (result.success) {
      // Give feedback before redirecting
      setFormData({ email: '', password: '' })
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 300)
    } else {
      setError(result.error || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            🚌
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Depot Admin</h1>
          <p className="text-slate-400">Smart Bus Fleet Management System</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="mb-6 text-xl font-bold text-white">Admin Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@depot.com"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">❌ {error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🔐 Logging in...' : '🔓 Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-slate-600 bg-slate-700/30 p-4">
            <p className="text-xs font-semibold text-slate-400 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>📧 Email: <span className="text-slate-300 font-mono">admin@depot.com</span></p>
              <p>🔑 Password: <span className="text-slate-300 font-mono">password123</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Protected Depot Management System
          </p>
          <p className="text-slate-600 text-xs mt-2">
            v1.0.0 • April 2026
          </p>
        </div>
      </div>
    </div>
  )
}
