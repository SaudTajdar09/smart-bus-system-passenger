import { Navigate, useLocation } from 'react-router-dom'

export function RequireAuth({ children }) {
  const location = useLocation()
  
  // Check if conductor is authenticated
  const conductorAuth = localStorage.getItem('conductorAuth')
  const isAuthenticated = conductorAuth ? JSON.parse(conductorAuth).authenticated : false

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
