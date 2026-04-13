/**
 * Serial number generator for manually created tickets in Conductor App
 * Maintains sequential numbering separate from auto-generated ticket IDs
 */

const SERIAL_KEY = 'citybus_manual_ticket_serial'

/**
 * Get the next serial number for manual tickets
 * Returns format: MAN-0001, MAN-0002, etc.
 */
export function getNextManualTicketSerial() {
  let currentSerial = localStorage.getItem(SERIAL_KEY)
  
  if (!currentSerial) {
    currentSerial = '0'
  }
  
  const nextNumber = parseInt(currentSerial, 10) + 1
  localStorage.setItem(SERIAL_KEY, nextNumber.toString())
  
  return `MAN-${String(nextNumber).padStart(4, '0')}`
}

/**
 * Reset serial counter (for testing/admin purposes)
 */
export function resetManualTicketSerial() {
  localStorage.removeItem(SERIAL_KEY)
  console.log('✅ Manual ticket serial counter reset')
}

/**
 * Get current serial number without incrementing
 */
export function getCurrentManualTicketSerial() {
  const currentSerial = localStorage.getItem(SERIAL_KEY) || '0'
  const nextNumber = parseInt(currentSerial, 10) + 1
  return `MAN-${String(nextNumber).padStart(4, '0')}`
}
