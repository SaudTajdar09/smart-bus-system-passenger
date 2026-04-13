import { useState } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { QRScanner } from '../components/scanner/QRScanner.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useConductor } from '../hooks/useConductor.js'
import { useSyncedTickets } from '../hooks/useSyncedTickets.js'

export function ScanTicket() {
  const { currentRoute } = useConductor()
  const { boardPassenger } = useSyncedTickets()
  const [showScanner, setShowScanner] = useState(false)
  const [scannedTicket, setScannedTicket] = useState(null)
  const [boardingResult, setBoardingResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleQRScan = async (ticketId) => {
    setIsProcessing(true)
    try {
      // Fetch the ticket from the API
      const response = await fetch(`http://localhost:3001/api/tickets?search=${ticketId}`)
      const tickets = await response.json()
      const ticket = tickets.find((t) => t.id === ticketId)

      if (!ticket) {
        setBoardingResult({
          success: false,
          message: '❌ Ticket not found',
          ticketId,
        })
        setScannedTicket(null)
      } else if (ticket.route !== currentRoute) {
        // Route mismatch - ticket is for a different route
        setBoardingResult({
          success: false,
          message: `⚠️ ROUTE MISMATCH!`,
          routeMismatch: true,
          ticket,
          currentRoute,
          ticketId,
        })
        setScannedTicket(null)
      } else if (ticket.status === 'boarded') {
        // Duplicate scan prevention
        setBoardingResult({
          success: false,
          message: '⚠️ Duplicate scan - Ticket already boarded!',
          isDuplicate: true,
          ticket,
          ticketId,
        })
        setScannedTicket(null)
      } else {
        // Valid ticket for current route - board the passenger
        const updateResponse = await fetch(`http://localhost:3001/api/tickets/${ticketId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'boarded', scanTime: new Date().toISOString() }),
        })

        if (updateResponse.ok) {
          // Sync to localStorage for other apps
          boardPassenger(ticketId)
          
          setBoardingResult({
            success: true,
            message: '✅ Ticket boarded successfully!',
            ticket,
          })
          setScannedTicket(ticket)
        } else {
          setBoardingResult({
            success: false,
            message: '❌ Failed to update ticket status',
            ticketId,
          })
          setScannedTicket(null)
        }
      }
    } catch (error) {
      console.error('❌ Scan error:', error)
      setBoardingResult({
        success: false,
        message: '❌ Error processing ticket: ' + error.message,
        ticketId,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseScan = () => {
    setShowScanner(false)
  }

  const handleNewScan = () => {
    setBoardingResult(null)
    setScannedTicket(null)
    setShowScanner(true)
  }

  return (
    <div className="space-y-4 p-4">
      <SectionTitle>Scan Passenger Ticket</SectionTitle>

      {/* Current Route Indicator */}
      <Card className="bg-blue-50 border border-blue-200">
        <p className="text-sm font-semibold text-blue-900">
          📍 Current Route: <span className="font-bold text-lg text-blue-600">{currentRoute}</span>
        </p>
        <p className="text-xs text-blue-700 mt-1">Only tickets booked for route {currentRoute} can be scanned here</p>
      </Card>

      {!showScanner && !boardingResult && (
        <Card>
          <p className="mb-4 text-center text-app-muted">Use camera to scan passenger ticket QR code</p>
          <Button onClick={() => setShowScanner(true)} className="w-full">
            📷 Start Scanner
          </Button>
        </Card>
      )}

      {showScanner && (
        <Card>
          <QRScanner onScan={handleQRScan} onClose={handleCloseScan} />
        </Card>
      )}

      {boardingResult && (
        <Card>
          {boardingResult.success ? (
            // SUCCESS STATE
            <div className="rounded-lg p-4 bg-green-100 border-2 border-green-500">
              <p className="text-center font-bold text-green-800 text-lg">{boardingResult.message}</p>

              {boardingResult.ticket && (
                <div className="mt-4 space-y-2 text-sm bg-white p-3 rounded">
                  <p>
                    <strong className="text-gray-700">Ticket ID:</strong> <span className="font-mono font-bold text-green-700">{boardingResult.ticket.id}</span>
                  </p>
                  <p>
                    <strong className="text-gray-700">Route:</strong> <span className="font-bold text-green-700">{boardingResult.ticket.route}</span>
                  </p>
                  <p>
                    <strong className="text-gray-700">Journey:</strong> {boardingResult.ticket.from} → {boardingResult.ticket.to}
                  </p>
                  <p>
                    <strong className="text-gray-700">Seat:</strong> {boardingResult.ticket.seat}
                  </p>
                  <p>
                    <strong className="text-gray-700">Fare:</strong> ₹{boardingResult.ticket.fare}
                  </p>
                </div>
              )}
            </div>
          ) : boardingResult.routeMismatch ? (
            // ROUTE MISMATCH ERROR
            <div className="rounded-lg p-4 bg-red-100 border-2 border-red-600">
              <p className="text-center font-bold text-red-900 text-lg">{boardingResult.message}</p>
              
              {boardingResult.ticket && (
                <div className="mt-4 space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-red-600">
                    <p className="text-sm text-red-800 mb-2">
                      <strong>❌ Ticket Route:</strong> <span className="font-bold text-lg text-red-900">{boardingResult.ticket.route}</span>
                    </p>
                    <p className="text-sm text-red-800">
                      <strong>📍 Current Bus Route:</strong> <span className="font-bold text-lg text-red-900">{boardingResult.currentRoute}</span>
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded text-sm">
                    <p className="text-gray-700">
                      <strong>Journey:</strong> {boardingResult.ticket.from} → {boardingResult.ticket.to}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <strong>Seat:</strong> {boardingResult.ticket.seat}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-600">
                    <p className="text-yellow-900 font-semibold text-sm">⚠️ Action Required:</p>
                    <p className="text-yellow-800 text-xs mt-1">
                      This ticket is for Route {boardingResult.ticket.route}. Please ask the passenger to board the correct bus or contact the conductor on Route {boardingResult.ticket.route}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : boardingResult.isDuplicate ? (
            // DUPLICATE SCAN ERROR
            <div className="rounded-lg p-4 bg-yellow-100 border-2 border-yellow-600">
              <p className="text-center font-bold text-yellow-900 text-lg">{boardingResult.message}</p>

              {boardingResult.ticket && (
                <div className="mt-4 space-y-2 text-sm bg-white p-3 rounded">
                  <p className="text-gray-700">
                    <strong>Ticket ID:</strong> <span className="font-mono font-bold">{boardingResult.ticket.id}</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Route:</strong> {boardingResult.ticket.route}
                  </p>
                  <p className="text-gray-700">
                    <strong>Seat:</strong> {boardingResult.ticket.seat}
                  </p>
                  {boardingResult.ticket.scanTime && (
                    <div className="bg-yellow-50 p-2 rounded mt-2">
                      <p className="text-xs text-yellow-800">
                        ⏰ Previously boarded at: {new Date(boardingResult.ticket.scanTime).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // OTHER ERRORS
            <div className="rounded-lg p-4 bg-red-100 border-2 border-red-500">
              <p className="text-center font-bold text-red-800">{boardingResult.message}</p>

              {boardingResult.ticketId && (
                <div className="mt-4 text-sm bg-white p-3 rounded">
                  <p className="text-gray-700">
                    <strong>Ticket ID:</strong> <span className="font-mono">{boardingResult.ticketId}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {!isProcessing && (
            <Button onClick={handleNewScan} className="mt-4 w-full">
              🔄 Scan Another Ticket
            </Button>
          )}

          {isProcessing && <p className="mt-4 text-center text-gray-600">Processing...</p>}
        </Card>
      )}
    </div>
  )
