import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'

const card = 'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'

export function ProfileUpdateModal({ onClose }) {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setMessage('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      updateProfile(formData)
      setMessage('✅ Profile updated successfully!')
      
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`${card} w-full max-w-md`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cb-text">✏️ Update Profile</h2>
          <button
            onClick={onClose}
            className="text-xl text-cb-text-secondary hover:text-cb-text transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text focus:outline-none focus:ring-2 focus:ring-cb-brand/50"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text focus:outline-none focus:ring-2 focus:ring-cb-brand/50"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text focus:outline-none focus:ring-2 focus:ring-cb-brand/50"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-xs text-green-600">{message}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-cb-text hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-cb-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cb-brand/20 hover:bg-cb-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
