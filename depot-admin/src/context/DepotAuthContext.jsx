import React, { createContext, useState, useEffect } from 'react'

export const DepotAuthContext = createContext()

export function DepotAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('depot_admin_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Demo authentication - in production, this would validate against a backend
    if (email && password && password.length >= 4) {
      const userData = {
        id: 'admin_' + Date.now(),
        email: email,
        name: email.split('@')[0].toUpperCase(),
        role: 'depot_admin',
        loginTime: new Date().toISOString(),
      }
      setUser(userData)
      localStorage.setItem('depot_admin_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('depot_admin_user')
  }

  return (
    <DepotAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </DepotAuthContext.Provider>
  )
}
