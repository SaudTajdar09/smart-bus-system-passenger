import { useContext } from 'react'
import { DepotAuthContext } from '../context/DepotAuthContext.jsx'

export function useDepotAuth() {
  const context = useContext(DepotAuthContext)
  if (!context) {
    throw new Error('useDepotAuth must be used within DepotAuthProvider')
  }
  return context
}
