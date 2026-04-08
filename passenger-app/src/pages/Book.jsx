import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'
import { BookingStepsRow } from '../components/passenger/BookingStepsRow.jsx'
import { RouteOptionCard } from '../components/passenger/RouteOptionCard.jsx'
import { StopPicker } from '../components/passenger/StopPicker.jsx'
import { SeatMapCity } from '../components/passenger/SeatMapCity.jsx'
import { PaymentMethodList } from '../components/passenger/PaymentMethodList.jsx'
import { QRTicketBlock } from '../components/passenger/QRTicketBlock.jsx'
import { ROUTES } from '../data/cityBusData.js'
import { useApp } from '../hooks/useApp.js'
import { useTickets } from '../hooks/useTickets.js'
import { formatInr } from '../utils/helpers.js'
import { fareForSegment, isValidStopPair } from '../utils/tripFare.js'
import { addHours, formatBookingDate, formatBookingTime } from '../utils/ticketTime.js'

const PLATFORM_FEE = 2
const CONFIRM_STEP = 4

export function Book() {
  const navigate = useNavigate()
  const {
    activeBookingStep,
    setActiveBookingStep,
    selectedSeats,
    setSelectedSeats,
    selectedRoute,
    setSelectedRoute,
    boardingStopIndex,
    setBoardingStopIndex,
    alightingStopIndex,
    setAlightingStopIndex,
    selectedPayment,
    setSelectedPayment,
    bookingConfirmation,
    setBookingConfirmation,
    resetBooking,
  } = useApp()

  const { addBookingTicket } = useTickets()
  const [payBusy, setPayBusy] = useState(false)

  const stops = selectedRoute?.stops ?? []
  const stopsValid = isValidStopPair(boardingStopIndex, alightingStopIndex, stops.length)

  function handleBoard(i) {
    setBoardingStopIndex(i)
    setAlightingStopIndex((prev) => {
      const last = Math.max(0, (selectedRoute?.stops?.length ?? 1) - 1)
      return prev <= i ? Math.min(i + 1, last) : prev
    })
  }

  function toggleSeat(id) {
    setSelectedSeats((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const seatCount = Math.max(selectedSeats.length || 1, 1)
  const unitFare = selectedRoute && stopsValid ? fareForSegment(selectedRoute, boardingStopIndex, alightingStopIndex) : 0
  const tripFare = unitFare * seatCount
  const total = tripFare + PLATFORM_FEE

  function processPayment() {
    if (!selectedRoute || !stopsValid) return
    setPayBusy(true)
    window.setTimeout(() => {
      const seats = selectedSeats.length ? [...selectedSeats] : ['14C']
      const ticketId = `TKT-${Date.now()}`
      const from = selectedRoute.stops[boardingStopIndex]
      const to = selectedRoute.stops[alightingStopIndex]
      const now = new Date()
      const bookedAt = now.toISOString()
      const expiresAt = addHours(bookedAt, 3)
      const date = formatBookingDate(now)
      const time = formatBookingTime(now)

      addBookingTicket({
        id: ticketId,
        routeId: selectedRoute.id,
        from,
        to,
        seats,
        date,
        time,
        fare: tripFare,
        bookedAt,
        expiresAt,
      })

      setBookingConfirmation({
        id: ticketId,
        routeName: selectedRoute.name,
        seat: seats[0],
        seats,
        date,
        time,
        from,
        to,
        expiresAt,
      })
      setActiveBookingStep(CONFIRM_STEP)
      setPayBusy(false)
    }, 1500)
  }

  if (activeBookingStep === CONFIRM_STEP && bookingConfirmation) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-inner shadow-emerald-100">
          OK
        </div>
        <div className="mb-1 text-xl font-semibold tracking-tight text-cb-text">Booking confirmed</div>
        <p className="mb-8 text-sm text-cb-text-secondary">Your QR ticket is ready</p>
        <QRTicketBlock
          id={bookingConfirmation.id}
          routeName={bookingConfirmation.routeName}
          seat={bookingConfirmation.seat}
          seats={bookingConfirmation.seats}
          date={bookingConfirmation.date}
          time={bookingConfirmation.time}
          from={bookingConfirmation.from}
          to={bookingConfirmation.to}
          expiresAt={bookingConfirmation.expiresAt}
        />
        <button
          type="button"
          className="mt-6 rounded-full bg-cb-brand px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cb-brand/25 transition hover:bg-cb-brand-hover"
          onClick={() => {
            resetBooking()
            navigate('/tickets')
          }}
        >
          View all tickets
        </button>
      </div>
    )
  }

  const backBtn =
    'rounded-full border border-slate-200/90 bg-white/90 px-4 py-1.5 text-xs font-semibold text-cb-text shadow-sm transition hover:border-slate-300 hover:bg-white'

  return (
    <>
      <SectionTitle>Book a seat</SectionTitle>
      <BookingStepsRow activeIndex={activeBookingStep} />

      {activeBookingStep === 0 && (
        <div className="space-y-3">
          {ROUTES.map((r) => (
            <RouteOptionCard
              key={r.id}
              route={r}
              onSelect={(route) => {
                setSelectedRoute(route)
                setSelectedSeats([])
                setBoardingStopIndex(0)
                setAlightingStopIndex(Math.max(0, route.stops.length - 1))
                setActiveBookingStep(1)
              }}
            />
          ))}
        </div>
      )}

      {activeBookingStep === 1 && selectedRoute && (
        <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.06] backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-cb-text-secondary">Route</p>
              <p className="text-sm font-semibold tracking-tight text-cb-text">{selectedRoute.name}</p>
            </div>
            <button
              type="button"
              className={backBtn}
              onClick={() => {
                setSelectedRoute(null)
                setActiveBookingStep(0)
                setSelectedSeats([])
              }}
            >
              Back
            </button>
          </div>
          <p className="mb-4 text-sm text-cb-text-secondary">Choose where you get on and off. Fare is based on distance along the route.</p>
          <StopPicker
            stops={stops}
            boardIndex={boardingStopIndex}
            alightIndex={alightingStopIndex}
            onChangeBoard={handleBoard}
            onChangeAlight={setAlightingStopIndex}
          />
          <div className="mt-5 rounded-xl bg-slate-50/90 px-3 py-2.5 text-center text-sm">
            <span className="text-cb-text-secondary">Trip fare </span>
            <span className="font-bold text-cb-text">{formatInr(unitFare)}</span>
            <span className="text-cb-text-tertiary"> / seat · </span>
            <span className="text-cb-text-secondary">{selectedRoute.stops[boardingStopIndex]}</span>
            <span className="mx-1 text-cb-text-tertiary">-&gt;</span>
            <span className="text-cb-text-secondary">{selectedRoute.stops[alightingStopIndex]}</span>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!stopsValid}
              className="rounded-full bg-cb-brand px-5 py-2 text-xs font-semibold text-white shadow-md shadow-cb-brand/20 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setActiveBookingStep(2)}
            >
              Continue to seats
            </button>
          </div>
        </div>
      )}

      {activeBookingStep === 2 && selectedRoute && (
        <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.06] backdrop-blur-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs text-cb-text-secondary">Trip</p>
              <p className="text-sm font-semibold text-cb-text">
                {selectedRoute.stops[boardingStopIndex]} -&gt; {selectedRoute.stops[alightingStopIndex]}
              </p>
            </div>
            <button type="button" className={backBtn} onClick={() => setActiveBookingStep(1)}>
              Back
            </button>
          </div>
          <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs text-cb-text-secondary">
            <span className="font-medium text-cb-text">{selectedRoute.name}</span>
            <span className="mx-2 text-cb-text-tertiary">·</span>
            {formatInr(unitFare)} per seat
          </div>
          <SeatMapCity routeId={selectedRoute.id} selectedSeats={selectedSeats} onToggle={toggleSeat} />
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-cb-text-secondary">
              Selected: <span className="font-semibold text-cb-text">{selectedSeats.length}</span> seat(s)
            </span>
            <button
              type="button"
              disabled={selectedSeats.length === 0}
              className="rounded-full bg-cb-brand px-5 py-2 text-xs font-semibold text-white shadow-md shadow-cb-brand/20 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setActiveBookingStep(3)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {activeBookingStep === 3 && selectedRoute && (
        <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.06] backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-cb-text">Payment</span>
            <button type="button" className={backBtn} onClick={() => setActiveBookingStep(2)}>
              Back
            </button>
          </div>
          <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2 text-xs">
            <span className="text-cb-text-secondary">Trip: </span>
            <span className="font-medium text-cb-text">
              {selectedRoute.stops[boardingStopIndex]} -&gt; {selectedRoute.stops[alightingStopIndex]}
            </span>
          </div>
          <DemoNote>Demo — No real payment will be charged</DemoNote>
          <PaymentMethodList selectedId={selectedPayment} onSelect={setSelectedPayment} />
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-cb-text-secondary">
              Fare × {seatCount} seat{seatCount !== 1 ? 's' : ''}
            </span>
            <span>
              {formatInr(unitFare)} × {seatCount}
            </span>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-cb-text-secondary">Subtotal</span>
            <span className="font-medium">{formatInr(tripFare)}</span>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-cb-text-secondary">Platform fee</span>
            <span>{formatInr(PLATFORM_FEE)}</span>
          </div>
          <div className="mb-4 flex justify-between text-base font-semibold text-cb-text">
            <span>Total</span>
            <span>{formatInr(total)}</span>
          </div>
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <button
            type="button"
            disabled={payBusy || !stopsValid}
            className="w-full rounded-full bg-cb-brand py-3 text-sm font-semibold text-white shadow-lg shadow-cb-brand/25 transition hover:bg-cb-brand-hover disabled:opacity-50"
            onClick={processPayment}
          >
            {payBusy ? 'Processing…' : `Pay ${formatInr(total)}`}
          </button>
        </div>
      )}
    </>
  )
}
