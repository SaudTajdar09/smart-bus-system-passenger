/**
 * Passenger Name Generation Utility
 * Generates realistic passenger names from ticket data
 */

const FIRST_NAMES = [
  'Rajesh', 'Priya', 'Amit', 'Divya', 'Rohit', 'Ananya', 'Vikram', 'Neha',
  'Arjun', 'Pooja', 'Nikhil', 'Isha', 'Arun', 'Shruti', 'Sanjay', 'Ritu',
  'Manoj', 'Simran', 'Akshay', 'Aditi', 'Rahul', 'Avni', 'Karan', 'Zara',
  'Suresh', 'Kavya', 'Harshit', 'Megha', 'Varun', 'Nisha',
]

const LAST_NAMES = [
  'Sharma', 'Kumar', 'Singh', 'Patel', 'Verma', 'Rao', 'Gupta', 'Joshi',
  'Reddy', 'Nair', 'Pillai', 'Das', 'Yadav', 'Mahajan', 'Iyer', 'Kulkarni',
  'Desai', 'Bhat', 'Amin', 'Kapoor',
]

/**
 * Generate a consistent passenger name based on ticket ID
 * Uses seeded randomization so same ticket always gets same name
 */
export function generatePassengerName(ticketId) {
  // Use ticket ID as seed for consistent name generation
  let hash = 0
  for (let i = 0; i < ticketId.length; i++) {
    hash = ((hash << 5) - hash) + ticketId.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }

  const firstNameIndex = Math.abs(hash) % FIRST_NAMES.length
  const lastNameIndex = Math.abs(hash >> 8) % LAST_NAMES.length

  return `${FIRST_NAMES[firstNameIndex]} ${LAST_NAMES[lastNameIndex]}`
}

/**
 * Generate a realistic seat number
 */
export function generateSeatNumber(ticketId, index = 0) {
  const hash = ticketId.charCodeAt(0) + index
  const row = Math.floor((hash % 40) / 4) + 1
  const col = String.fromCharCode(65 + (hash % 4))
  return `${row}${col}`
}

/**
 * Get consistent color based on ticket ID (for visual grouping)
 */
export function getPassengerColor(ticketId) {
  const colors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-pink-50', 'bg-indigo-50']
  const index = Math.abs(ticketId.charCodeAt(0)) % colors.length
  return colors[index]
}
