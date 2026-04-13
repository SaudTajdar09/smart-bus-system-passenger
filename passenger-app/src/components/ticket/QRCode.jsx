import React, { useEffect, useRef } from 'react'

/**
 * Real QR Code Generator using Canvas
 * Encodes ticket ID for scanning by conductor app
 */
export function QRCode({ value }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    // Dynamic import to avoid build issues
    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, value, { width: 96 }, (err) => {
        if (err) console.error('QR generation error:', err)
      })
    }).catch((err) => {
      console.error('Failed to load qrcode library:', err)
    })
  }, [value])

  return (
    <div className="w-24 shrink-0 text-center" role="img" aria-label={`QR code for ${value}`}>
      <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-app-elevated bg-white">
        <canvas
          ref={canvasRef}
          className="h-24 w-24"
        />
      </div>
      <span className="mt-1.5 block break-all text-[0.6rem] text-app-muted">{value}</span>
    </div>
  )
}
