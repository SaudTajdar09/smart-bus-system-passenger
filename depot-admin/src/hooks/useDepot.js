import { useContext } from 'react'
import { DepotContext } from '../context/DepotContext.jsx'

export function useDepot() {
  const context = useContext(DepotContext)
  if (!context) {
    throw new Error('useDepot must be used within a DepotProvider')
  }
  return context
}
