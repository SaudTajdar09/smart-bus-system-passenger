/**
 * Simple user database - stores user profiles in localStorage
 * For demo purposes only - in production use a real backend with secure password hashing
 */

const USERS_STORAGE_KEY = 'citybus_passenger_users'
const DEMO_USERS = [
  {
    id: 'user-1',
    name: 'Arjun Mehta',
    email: 'arjun@demo.com',
    password: 'password123', // Demo password (unhashed for demo only)
    phone: '+91 90000 12345',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Priya Singh',
    email: 'priya@demo.com',
    password: 'password123',
    phone: '+91 90001 12345',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'Raj Patel',
    email: 'raj@demo.com',
    password: 'password123',
    phone: '+91 90002 12345',
    createdAt: new Date().toISOString(),
  },
]

/**
 * Initialize users database with demo data if empty
 */
export function initializeUsersDatabase() {
  const existing = localStorage.getItem(USERS_STORAGE_KEY)
  if (!existing) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS))
    console.log('✅ User database initialized with demo users')
  }
}

/**
 * Get all users from database
 */
export function getAllUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

/**
 * Find user by email
 */
export function findUserByEmail(email) {
  const users = getAllUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

/**
 * Find user by ID
 */
export function findUserById(id) {
  const users = getAllUsers()
  return users.find((u) => u.id === id)
}

/**
 * Authenticate user with email and password
 * @returns {Object} User object without password if successful, null otherwise
 */
export function authenticateUser(email, password) {
  const user = findUserByEmail(email)
  
  if (!user) {
    console.log('❌ User not found:', email)
    return null
  }
  
  // Simple password comparison (NOT secure - for demo only!)
  if (user.password !== password) {
    console.log('❌ Password incorrect for:', email)
    return null
  }
  
  console.log('✅ User authenticated:', email)
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Create new user account
 */
export function createUser(email, password, name, phone) {
  // Validate inputs
  if (!email || !password || !name) {
    console.error('Missing required fields for user creation')
    return null
  }
  
  // Check if email already exists
  if (findUserByEmail(email)) {
    console.error('Email already registered:', email)
    return null
  }
  
  // Validate password length (minimum 6 characters)
  if (password.length < 6) {
    console.error('Password must be at least 6 characters')
    return null
  }
  
  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password, // Store unhashed for demo (NEVER do this in production!)
    phone: phone || '',
    createdAt: new Date().toISOString(),
  }
  
  // Save to database
  const users = getAllUsers()
  users.push(newUser)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  
  console.log('✅ New user created:', email)
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

/**
 * Update user profile
 */
export function updateUserProfile(userId, updates) {
  const users = getAllUsers()
  const userIndex = users.findIndex((u) => u.id === userId)
  
  if (userIndex === -1) {
    console.error('User not found:', userId)
    return null
  }
  
  // Don't allow changing email without verification (for security)
  const { email, password, ...safeUpdates } = updates
  
  users[userIndex] = {
    ...users[userIndex],
    ...safeUpdates,
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  
  console.log('✅ User profile updated:', userId)
  
  const { password: _, ...userWithoutPassword } = users[userIndex]
  return userWithoutPassword
}

/**
 * Delete user account
 */
export function deleteUser(userId) {
  const users = getAllUsers()
  const filtered = users.filter((u) => u.id !== userId)
  
  if (filtered.length === users.length) {
    console.error('User not found:', userId)
    return false
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered))
  console.log('✅ User deleted:', userId)
  return true
}
