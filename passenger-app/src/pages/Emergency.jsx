import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { saveAlertToStorage } from '../utils/alertStorage.js'

const card = 'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'

export function Emergency() {
  const { user } = useAuth()
  const [alertMsg, setAlertMsg] = useState(null)
  const [sending, setSending] = useState(false)

  async function sendAlert(type) {
    setSending(true)

    // Get current route (demo: default to R1, in real app would be actual route)
    const currentRoute = localStorage.getItem('passenger_current_route') || 'R1'

    // Create alert with passenger details
    const alert = saveAlertToStorage({
      type, // 'Police', 'Hospital', 'Depot'
      passengerName: user?.name || 'Unknown Passenger',
      passengerEmail: user?.email || 'unknown@demo.com',
      route: currentRoute,
      location: 'On Bus', // Demo location
      timestamp: new Date().toISOString(),
      status: 'active',
    })

    if (alert) {
      // Cross-app sync: publish alert to shared backend (works across different app ports)
      try {
        await fetch('http://localhost:3001/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        })
      } catch (error) {
        console.warn('⚠️ Alert API sync failed; kept in localStorage only', error)
      }

      // Show confirmation
      setAlertMsg({
        success: true,
        type,
        id: alert.id,
      })

      console.log('🚨 Emergency alert sent:', {
        type,
        passenger: user?.name,
        route: currentRoute,
        alertId: alert.id,
      })

      // Clear message after 5 seconds
      setTimeout(() => setAlertMsg(null), 5000)
    } else {
      setAlertMsg({
        success: false,
        type,
      })
      setTimeout(() => setAlertMsg(null), 4000)
    }

    setSending(false)
  }

  return (
    <>
      <SectionTitle>Emergency services</SectionTitle>

      <div className={`${card} flex items-center gap-3 border-red-100 bg-red-50/90 text-sm text-cb-red-text`}>
        <span className="text-lg" aria-hidden>
          ⚠️
        </span>
        <span className="font-medium">Use only in genuine emergencies</span>
      </div>

      <div className={card}>
        <button
          type="button"
          disabled={sending}
          className="mb-3 w-full rounded-2xl border-0 bg-cb-brand-soft py-5 text-left text-base font-semibold text-cb-brand-text shadow-sm transition hover:bg-sky-100 disabled:opacity-50"
          onClick={() => sendAlert('Police')}
        >
          🚔 Alert Police
          <br />
          <span className="text-xs font-normal opacity-80">Sends your location to nearest station</span>
        </button>
        <button
          type="button"
          disabled={sending}
          className="mb-3 w-full rounded-2xl border-0 bg-emerald-50 py-5 text-left text-base font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100 disabled:opacity-50"
          onClick={() => sendAlert('Hospital')}
        >
          🏥 Call Ambulance
          <br />
          <span className="text-xs font-normal opacity-80">Emergency medical dispatch</span>
        </button>
        <button
          type="button"
          disabled={sending}
          className="w-full rounded-2xl border-0 bg-amber-50 py-5 text-left text-base font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 disabled:opacity-50"
          onClick={() => sendAlert('Depot')}
        >
          🏢 Alert Depot Manager
          <br />
          <span className="text-xs font-normal opacity-80">Incident report sent to depot</span>
        </button>
      </div>

      {alertMsg ? (
        <div className={`${card} flex items-start gap-3 border-2 p-4 ${
          alertMsg.success
            ? 'border-emerald-200 bg-emerald-50/90'
            : 'border-red-200 bg-red-50/90'
        }`}>
          <span className="text-2xl">{alertMsg.success ? '✓' : '❌'}</span>
          <div>
            <p className={`font-semibold ${alertMsg.success ? 'text-emerald-900' : 'text-red-900'}`}>
              {alertMsg.success ? `Alert sent to ${alertMsg.type}` : 'Alert failed'}
            </p>
            {alertMsg.success && (
              <>
                <p className={`text-sm mt-2 ${alertMsg.success ? 'text-emerald-800' : 'text-red-800'}`}>
                  Passenger: {user?.name || 'Unknown'}
                </p>
                <p className={`text-xs opacity-75 mt-1 font-mono`}>
                  Alert ID: {alertMsg.id}
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}

      <div className={card}>
        <div className="mb-4 text-sm font-semibold text-cb-text">Emergency contacts</div>
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-cb-text-secondary">Police</span>
          <span className="font-semibold text-cb-brand-text">100</span>
        </div>
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-cb-text-secondary">Ambulance</span>
          <span className="font-semibold text-emerald-700">108</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cb-text-secondary">Depot Helpline</span>
          <span className="font-semibold text-amber-800">1800-BUS-HELP</span>
        </div>
      </div>
    </>
  )
}
