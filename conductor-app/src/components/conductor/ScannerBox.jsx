import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useConductor } from '../../hooks/useConductor.js'
import { Badge } from '../ui/Badge.jsx'

export function ScannerBox() {
  const { scanTicket, scanFeedback } = useConductor()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const qrScannerRef = useRef(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!scanning) return

    const startScanning = async () => {
      try {
        // Check if scanner already exists and is running
        if (qrScannerRef.current && isInitializedRef.current) {
          console.log('Scanner already running')
          return
        }

        const qrcode = new Html5Qrcode('qr-scanner-conductor', {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
        })

        qrScannerRef.current = qrcode

        // Define the success callback
        const onScanSuccess = (decodedText, decodedResult) => {
          console.log('✅ QR Scanned:', decodedText)
          scanTicket(decodedText) // Call the conductor context function
          // Don't stop the scanner - let it continue for multiple scans
        }

        // Define the error callback (suppressed)
        const onScanError = (error) => {
          // Ignore scanning errors (continuous)
        }

        // Start scanning
        await qrcode.start(
          { facingMode: 'environment' }, // Use rear camera
          { fps: 10, qrbox: { width: 200, height: 200 } },
          onScanSuccess,
          onScanError,
        )

        isInitializedRef.current = true
        setScanning(true)
        setError(null)
        console.log('✅ Scanner started successfully')
      } catch (err) {
        console.error('❌ Scanner start error:', err)
        setError(err.message)
        setScanning(false)
        isInitializedRef.current = false
      }
    }

    startScanning()

    return () => {
      // Cleanup on unmount
      if (qrScannerRef.current && isInitializedRef.current) {
        qrScannerRef.current
          .stop()
          .then(() => {
            console.log('Scanner stopped')
            isInitializedRef.current = false
          })
          .catch((e) => {
            console.warn('Scanner stop error:', e)
            isInitializedRef.current = false
          })
      }
    }
  }, [scanning, scanTicket])

  const toggleScanning = async () => {
    if (scanning) {
      try {
        if (qrScannerRef.current && isInitializedRef.current) {
          await qrScannerRef.current.stop()
          isInitializedRef.current = false
        }
        setScanning(false)
      } catch (err) {
        console.error('❌ Error stopping scanner:', err)
        setError(err.message)
        setScanning(false)
        isInitializedRef.current = false
      }
    } else {
      setScanning(true)
    }
  }

  const handleManualScan = async () => {
    const ticketId = prompt('Enter Ticket ID (e.g., TKT-1712800000000-456):')
    if (ticketId) {
      await scanTicket(ticketId)
    }
  }

  return (
    <div className="mb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-xl">
        {/* Camera Placeholder / Scanner Container */}
        <div
          id="qr-scanner-conductor"
          className="mb-6 aspect-square rounded-2xl bg-black/40 border-2 border-dashed border-white/30 overflow-hidden flex items-center justify-center"
          style={{ minHeight: '250px' }}
        >
          {!scanning && (
            <div className="text-center">
              <div className="mb-2 text-4xl">📷</div>
              <div className="text-sm opacity-70">QR Camera</div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <div className="mb-4 rounded-lg bg-red-400/30 p-3 text-sm text-red-100 border border-red-300">{error}</div>}

        {/* Scan Buttons */}
        <div className="space-y-2">
          <button
            onClick={toggleScanning}
            className="w-full rounded-full bg-white py-4 text-lg font-bold text-blue-600 shadow-lg transition hover:shadow-xl hover:scale-105"
          >
            {scanning ? '⏹ Stop Camera' : '🔍 Start Camera'}
          </button>

          <button
            onClick={handleManualScan}
            className="w-full rounded-full bg-white/20 py-3 text-base font-semibold text-white border border-white/30 transition hover:bg-white/30"
          >
            ⌨️ Manual Entry
          </button>
        </div>

        {/* Feedback */}
        {scanFeedback && (
          <div
            className={`mt-4 rounded-lg p-4 text-center text-sm font-semibold animate-bounce ${
              scanFeedback.type === 'success'
                ? 'bg-emerald-400/30 text-emerald-100 border border-emerald-300'
                : 'bg-red-400/30 text-red-100 border border-red-300'
            }`}
          >
            {scanFeedback.message}
          </div>
        )}
      </div>
    </div>
  )
}
