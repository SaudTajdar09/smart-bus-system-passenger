import { useCallback, useMemo, useState } from 'react'
import { AppContext } from './app-context.js'

export function AppProvider({ children }) {
  const [activeBookingStep, setActiveBookingStep] = useState(0)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [boardingStopIndex, setBoardingStopIndex] = useState(0)
  const [alightingStopIndex, setAlightingStopIndex] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [bookingConfirmation, setBookingConfirmation] = useState(null)

  const resetBooking = useCallback(() => {
    setActiveBookingStep(0)
    setSelectedSeats([])
    setSelectedRoute(null)
    setBoardingStopIndex(0)
    setAlightingStopIndex(0)
    setSelectedPayment('upi')
    setBookingConfirmation(null)
  }, [])

  const value = useMemo(
    () => ({
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
    }),
    [
      activeBookingStep,
      selectedSeats,
      selectedRoute,
      boardingStopIndex,
      alightingStopIndex,
      selectedPayment,
      bookingConfirmation,
      resetBooking,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
