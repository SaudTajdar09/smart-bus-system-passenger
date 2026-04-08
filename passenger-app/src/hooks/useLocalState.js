import { useCallback, useState } from 'react'

export function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  const setPersisted = useCallback(
    (next) => {
      setState((prev) => {
        const value = typeof next === 'function' ? next(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(value))
        } catch {
          /* ignore quota */
        }
        return value
      })
    },
    [key],
  )

  return [state, setPersisted]
}
