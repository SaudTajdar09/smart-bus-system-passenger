import { useEffect, useRef, useState } from 'react'
import Html5QrcodePlugin from 'html5-qrcode'
import { Button } from '../ui/Button.jsx'

export function QRScanner({ onScan, onClose }) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const qrScannerRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!scanning) return

    const startScanning = async () => {
      try {
        const qrcode = new Html5QrcodePlugin.Html5Qrcode('qr-scanner-container', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        })

        qrScannerRef.current = qrcode

        // Define the success callback
        const onScanSuccess = (decodedText, decodedResult) => {
          console.log('✅ QR Scanned:', decodedText)
          onScan(decodedText)
          stopScanning()
        }

        // Define the error callback (suppressed)
        const onScanError = (error) => {
          // Ignore scanning errors (continuous)
        }

        // Start scanning
        await qrcode.start(
          { facingMode: 'environment' }, // Use rear camera
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          onScanError,
        )

        setScanning(true)
        setError(null)
      } catch (err) {
        console.error('❌ Scanner error:', err)
        setError(err.message)
        setScanning(false)
      }
    }

    startScanning()

    return () => {
      // Cleanup on unmount
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch((e) => console.warn('Scanner stop error:', e))
      }
    }
  }, [scanning, onScan])

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop().catch((e) => console.warn('Scanner stop error:', e))
    }
    setScanning(false)
    onClose?.()
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">❌ {error}</div>}

      <div
        ref={containerRef}
        id="qr-scanner-container"
        className="relative w-full overflow-hidden rounded-lg border-2 border-blue-500 bg-black"
        style={{ minHeight: '400px' }}
      />

      <div className="flex gap-2">
        {!scanning ? (
          <Button onClick={() => setScanning(true)} className="flex-1">
            📷 Start Camera
          </Button>
        ) : (
          <Button onClick={stopScanning} tone="danger" className="flex-1">
            ⏹ Stop Camera
          </Button>
        )}

        <Button onClick={onClose} tone="secondary" className="flex-1">
          Cancel
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">Point camera at a ticket QR code</p>
    </div>
  )
}
