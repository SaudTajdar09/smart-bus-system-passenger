import { useMemo, useState, useEffect } from 'react'
import { AuthContext } from './auth-context.js'
import { initializeUsersDatabase, authenticateUser, createUser, updateUserProfile } from '../utils/userDatabase.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize user database and load current user from localStorage on mount
  useEffect(() => {
    initializeUsersDatabase()
    
    const storedUser = localStorage.getItem('passenger_app_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      
      // Login with email and password
      loginWithCredentials: (email, password) => {
        const authenticatedUser = authenticateUser(email, password)
        if (authenticatedUser) {
          setUser(authenticatedUser)
          localStorage.setItem('passenger_app_user', JSON.stringify(authenticatedUser))
          console.log('✅ User logged in:', email)
          return { success: true, user: authenticatedUser }
        }
        console.log('❌ Login failed for:', email)
        return { success: false, error: 'Invalid email or password' }
      },
      
      // Register new user
      register: (email, password, name, phone) => {
        const newUser = createUser(email, password, name, phone)
        if (newUser) {
          // Auto-login after successful registration
          setUser(newUser)
          localStorage.setItem('passenger_app_user', JSON.stringify(newUser))
          console.log('✅ User registered and logged in:', email)
          return { success: true, user: newUser }
        }
        return { success: false, error: 'Could not create user - email may already be in use or password too short' }
      },
      
      // Legacy login for demo purposes (backward compatibility)
      login: () => {
        const defaultUser = { 
          id: 'demo-user',
          name: 'Arjun Mehta',
          role: 'passenger',
          phone: '+91 90000 12345',
          email: 'arjun@demo.com'
        }
        setUser(defaultUser)
        localStorage.setItem('passenger_app_user', JSON.stringify(defaultUser))
      },
      
      logout: () => {
        setUser(null)
        localStorage.removeItem('passenger_app_user')
        console.log('✅ User logged out')
      },
      
      updateProfile: (updatedFields) => {
        if (!user) return false
        const updated = updateUserProfile(user.id, updatedFields)
        if (updated) {
          setUser(updated)
          localStorage.setItem('passenger_app_user', JSON.stringify(updated))
          return true
        }
        return false
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
