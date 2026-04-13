import { useState, useMemo } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'
import { Card } from '../components/ui/Card.jsx'
import { PrintTicketModal } from '../components/ticket/PrintTicketModal.jsx'
import { useConductor } from '../hooks/useConductor.js'
import { getNextManualTicketSerial } from '../utils/serialNumber.js'
import { CONDUCTOR_ROUTES } from '../data/conductorData.js'
import { saveTicket } from '../utils/ticketStorage.js'

const card = 'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'

// Generate seat map (5 rows, 8 seats per row)
const TOTAL_SEATS = 40
function generateSeats() {
  const seats = []
  for (let row = 1; row <= 5; row++) {
    for (let col = 0; col < 4; col++) {
      seats.push(`${row}${String.fromCharCode(65 + col)}`)
    }
  }
  return seats
}

const ALL_SEATS = generateSeats()

export function ManualTicket() {
  const { currentRoute, passengers } = useConductor()
  
  const [formData, setFormData] = useState({
    route: currentRoute || 'R1',
    from: '',
    to: '',
    seat: '',
  })
  
  const [issuedTicket, setIssuedTicket] = useState(null)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const route = useMemo(() => {
    return CONDUCTOR_ROUTES.find(r => r.id === formData.route)
  }, [formData.route])

  const stops = route?.stops || []

  // Get booked seats from passengers on current route
  const bookedSeats = useMemo(() => {
    return passengers
      .filter(p => p.route === formData.route)
      .map(p => p.seat)
  }, [passengers, formData.route])

  const availableSeats = useMemo(() => {
    return ALL_SEATS.filter(seat => !bookedSeats.includes(seat))
  }, [bookedSeats])

  // Calculate fare based on stops
  const calculatedFare = useMemo(() => {
    if (!route || !formData.from || !formData.to) return 0
    
    const fromIndex = stops.indexOf(formData.from)
    const toIndex = stops.indexOf(formData.to)
    
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return 0
    
    // Base fare: ₹5 per stop
    const baseToStopsFare = (toIndex - fromIndex) * 5
    
    // Add category premium
    const isPremiumRoute = route.id === 'R2' || route.id === 'R4'
    const premium = isPremiumRoute ? 5 : 0
    
    return baseToStopsFare + premium
  }, [route, formData.from, formData.to, stops])

  const isFormValid = formData.from && formData.to && formData.seat

  async function issueTicket(e) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate stops
      if (formData.from === formData.to) {
        throw new Error('Boarding and alighting stops cannot be the same')
      }

      const fromIndex = stops.indexOf(formData.from)
      const toIndex = stops.indexOf(formData.to)

      if (fromIndex === -1 || toIndex === -1) {
        throw new Error('Invalid stops selected')
      }

      if (fromIndex >= toIndex) {
        throw new Error('Alighting stop must be after boarding stop')
      }

      // Check if seat is available
      if (bookedSeats.includes(formData.seat)) {
        throw new Error('Selected seat is already booked')
      }

      // Generate serial number for manual ticket
      const manualSerial = getNextManualTicketSerial()

      // Save to API with boarded status
      const ticket = await saveTicket(
        {
          route: formData.route,
          from: formData.from,
          to: formData.to,
          seat: formData.seat,
          seats: [formData.seat],
          fare: calculatedFare,
          date: new Date().toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          time: new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          conductorIssued: true,
          manualSerial: manualSerial, // Add serial for manual tickets
          createdFrom: 'manual', // Mark as manually created
        },
        {
          status: 'boarded',
          scanTime: new Date().toISOString(),
        }
      )

      if (!ticket) {
        throw new Error('Failed to issue ticket')
      }

      console.log('🎫 Manual ticket issued:', ticket.id)
      setIssuedTicket(ticket)
      
      // Reset form
      setFormData({
        route: currentRoute || 'R1',
        from: '',
        to: '',
        seat: '',
      })

      // Clear success message after 5 seconds
      setTimeout(() => setIssuedTicket(null), 5000)
    } catch (err) {
      setError(err.message)
      console.error('❌ Error issuing ticket:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SectionTitle>Issue Manual Ticket</SectionTitle>
      <DemoNote>Directly issue tickets to passengers traveling on this route</DemoNote>

      {/* Success Message */}
      {issuedTicket && (
        <div className={`${card} border-emerald-200 bg-emerald-50/90 animated-pulse`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <p className="font-bold text-emerald-900">Ticket Issued Successfully!</p>
              <p className="text-sm text-emerald-700 mt-1">
                <span className="font-mono font-bold">{issuedTicket.id}</span>
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Seat: {issuedTicket.seat} | Fare: ₹{issuedTicket.fare} | Route: {issuedTicket.from} → {issuedTicket.to}
              </p>
              <button
                onClick={() => setShowPrintModal(true)}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition text-sm"
              >
                🖨️ Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`${card} border-red-200 bg-red-50/90`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-bold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Form */}
      <form onSubmit={issueTicket} className={card}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-cb-text mb-2">Route</label>
          <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-cb-text">
            {route?.name || 'Select a route'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold text-cb-text mb-2">From Stop *</label>
            <select
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value, to: '', seat: '' })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            >
              <option value="">Select stop</option>
              {stops.map((stop, idx) => (
                <option key={idx} value={stop}>{stop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cb-text mb-2">To Stop *</label>
            <select
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value, seat: '' })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
              disabled={!formData.from}
            >
              <option value="">Select stop</option>
              {stops.map((stop, idx) => (
                <option key={idx} value={stop} disabled={stops.indexOf(stop) <= stops.indexOf(formData.from)}>
                  {stop}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auto-calculated Fare */}
        {formData.from && formData.to && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-blue-900">Calculated Fare</span>
              <span className="text-2xl font-bold text-blue-600">₹{calculatedFare}</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {stops.indexOf(formData.to) - stops.indexOf(formData.from)} stops × ₹5
            </p>
          </div>
        )}

        {/* Available Seats */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-cb-text mb-2">
            Select Seat * ({availableSeats.length} available)
          </label>
          
          <div className="mb-3 grid grid-cols-4 gap-2">
            {ALL_SEATS.map((seat) => {
              const isBooked = bookedSeats.includes(seat)
              const isSelected = formData.seat === seat
              
              return (
                <button
                  key={seat}
                  type="button"
                  onClick={() => !isBooked && setFormData({ ...formData, seat })}
                  disabled={isBooked}
                  className={`py-2 rounded font-semibold text-sm transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-2 border-emerald-700'
                      : isBooked
                      ? 'bg-red-100 text-red-600 cursor-not-allowed opacity-50'
                      : 'bg-slate-100 text-cb-text border-2 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {seat}
                </button>
              )
            })}
          </div>

          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded"></div>
              <span className="text-cb-text-secondary">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-cb-text-secondary">Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-emerald-600 rounded"></div>
              <span className="text-cb-text-secondary">Selected</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Issuing...' : `🎫 Issue Ticket (₹${calculatedFare})`}
        </button>
      </form>

      {/* Info Card */}
      <div className={`${card} border-slate-200 bg-slate-50/50`}>
        <p className="text-xs font-semibold text-cb-text mb-2">ℹ️ Auto-Calculation</p>
        <ul className="text-xs text-cb-text-secondary space-y-1">
          <li>• Fare = (Number of stops × ₹5) + Route premium</li>
          <li>• Red seats are already booked</li>
          <li>• Select any available seat to issue</li>
          <li>• Ticket ID auto-generated</li>
          <li>• Updates in real-time</li>
        </ul>
      </div>

      {/* Print Modal */}
      {showPrintModal && issuedTicket && (
        <PrintTicketModal
          ticket={issuedTicket}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </>
  )
}
