import { useEffect, useState, useRef } from 'react'
import { CityBadge } from '../ui/CityBadge.jsx'
import { passengerSeatSummary } from '../../utils/ticketDisplay.js'
import { expiryRemainingText } from '../../utils/ticketTime.js'

export function QRTicketBlock({ id, routeName, seat, seats, date, time, from, to, expiresAt }) {
  const synthetic = { seat, seats }
  const { count, line } = passengerSeatSummary(synthetic)
  const [now, setNow] = useState(() => new Date())
  const canvasRef = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !id) return

    // Generate QR code using canvas
    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, id, { width: 128 }, (err) => {
        if (err) console.error('QR generation error:', err)
      })
    }).catch((err) => {
      console.error('Failed to load qrcode library:', err)
    })
  }, [id])

  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-5 text-center shadow-inner">
      <div className="mx-auto mb-4 flex h-[140px] w-[140px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <canvas
          ref={canvasRef}
          className="h-24 w-24"
        />
      </div>
      <div className="mb-1 font-mono text-base font-semibold tracking-widest text-cb-text">{id}</div>
      <div className="text-[13px] text-cb-text-secondary">Route: {routeName}</div>
      {from && to ? (
        <div className="mt-2 text-[13px] font-medium text-cb-text">
          {from} <span className="text-cb-text-tertiary">-&gt;</span> {to}
        </div>
      ) : null}
      {count > 0 ? (
        <div className="mt-3 rounded-xl bg-cb-brand-soft/60 px-3 py-2 text-[13px] font-semibold text-cb-brand-text">{line}</div>
      ) : null}
      <div className="mt-2 text-[13px] text-cb-text-secondary">
        {date} · {time}
      </div>
      <div className="mt-2 text-xs font-medium text-amber-700">{expiryRemainingText(expiresAt, now)}</div>
      <div className="mt-3">
        <CityBadge variant="green">Valid · Scan to board</CityBadge>
      </div>
    </div>
  )
}
