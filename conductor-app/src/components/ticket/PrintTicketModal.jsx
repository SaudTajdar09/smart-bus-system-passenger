import { useRef } from 'react'
import { Button } from '../ui/Button.jsx'

export function PrintTicketModal({ ticket, onClose }) {
  const printRef = useRef(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow.document.write(printRef.current.innerHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Print Ticket</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded transition"
          >
            ✕
          </button>
        </div>

        {/* Printable Ticket */}
        <div ref={printRef} className="p-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg p-8 text-center space-y-4 border-4 border-dashed border-slate-600">
            {/* Bus Company Header */}
            <div className="border-b border-slate-600 pb-4">
              <h1 className="text-3xl font-black tracking-wider">🚌 CITY BUS</h1>
              <p className="text-xs text-slate-300 mt-1">Smart Public Transport System</p>
            </div>

            {/* Ticket ID & Type */}
            <div className="space-y-2">
              <p className="text-2xl font-bold font-mono tracking-widest">{ticket.id}</p>
              <p className="text-xs text-slate-300">CONDUCTOR ISSUED TICKET</p>
            </div>

            <div className="border-t border-b border-slate-600 py-4 space-y-3">
              {/* Route Information */}
              <div className="bg-slate-700/50 rounded p-3">
                <p className="text-xs text-slate-300 mb-1">ROUTE</p>
                <p className="text-xl font-bold">{ticket.route}</p>
              </div>

              {/* Journey Details */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-slate-300">FROM</p>
                  <p className="font-bold text-sm">{ticket.from}</p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-xl">→</span>
                </div>
                <div>
                  <p className="text-xs text-slate-300">TO</p>
                  <p className="font-bold text-sm">{ticket.to}</p>
                </div>
              </div>

              {/* Seat & Fare */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-300">SEAT</p>
                  <p className="text-2xl font-black border-2 border-slate-500 rounded p-2">{ticket.seat}</p>
                </div>
                <div className="bg-emerald-500/20 border-2 border-emerald-400 rounded p-2">
                  <p className="text-xs text-slate-300">FARE</p>
                  <p className="text-3xl font-black text-emerald-300">₹{ticket.fare}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-300">DATE</p>
                  <p className="text-sm font-semibold">{ticket.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300">TIME</p>
                  <p className="text-sm font-semibold">{ticket.time}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-emerald-500 text-slate-900 rounded p-3">
              <p className="font-black tracking-wider">✓ VALID TICKET</p>
              <p className="text-xs mt-1 text-slate-800">Keep this ticket safe for verification</p>
            </div>

            {/* Footer */}
            <div className="text-xs text-slate-400 border-t border-slate-600 pt-3">
              <p>Valid for single journey only</p>
              <p>Show at bus entry for boarding</p>
              <p className="mt-2 font-mono text-xs">{new Date().toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 flex gap-3">
          <Button onClick={handlePrint} variant="primary" className="flex-1">
            🖨️ Print Ticket
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
