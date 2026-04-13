import { Navigate } from 'react-router-dom'
import { useDepotAuth } from '../hooks/useDepotAuth.js'

export function ProtectedRoute({ children }) {
  const { user, loading } = useDepotAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
