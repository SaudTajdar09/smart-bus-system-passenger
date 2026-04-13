import { useContext } from 'react'
import { ConductorContext } from '../context/conductor-context.js'

export function useConductor() {
  const ctx = useContext(ConductorContext)
  if (!ctx) throw new Error('useConductor must be used within ConductorProvider')
  return ctx
}
