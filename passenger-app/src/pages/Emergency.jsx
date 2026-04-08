import { useState } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'

const card = 'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'

export function Emergency() {
  const [alertMsg, setAlertMsg] = useState(null)

  function sendAlert(type) {
    setAlertMsg(type)
    window.setTimeout(() => setAlertMsg(null), 4000)
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
          className="mb-3 w-full rounded-2xl border-0 bg-cb-brand-soft py-5 text-left text-base font-semibold text-cb-brand-text shadow-sm transition hover:bg-sky-100"
          onClick={() => sendAlert('Police')}
        >
          🚔 Alert Police
          <br />
          <span className="text-xs font-normal opacity-80">Sends your location to nearest station</span>
        </button>
        <button
          type="button"
          className="mb-3 w-full rounded-2xl border-0 bg-emerald-50 py-5 text-left text-base font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
          onClick={() => sendAlert('Hospital')}
        >
          🏥 Call Ambulance
          <br />
          <span className="text-xs font-normal opacity-80">Emergency medical dispatch</span>
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border-0 bg-amber-50 py-5 text-left text-base font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100"
          onClick={() => sendAlert('Depot')}
        >
          🏢 Alert Depot Manager
          <br />
          <span className="text-xs font-normal opacity-80">Incident report sent to depot</span>
        </button>
      </div>

      {alertMsg ? (
        <div className={`${card} flex items-center gap-3 border-emerald-200 bg-emerald-50/90 text-sm font-medium text-emerald-900`}>
          ✓ Alert sent to {alertMsg} — help is on the way (demo)
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
