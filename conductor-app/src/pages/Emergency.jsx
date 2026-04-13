import { useState } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'

const card = 'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'

export function Emergency() {
  const [alertMsg, setAlertMsg] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  function sendAlert(type) {
    setSelectedType(type)
    setAlertMsg(type)
    console.log(`🚨 Emergency alert sent: ${type}`)
    window.setTimeout(() => {
      setAlertMsg(null)
      setSelectedType(null)
    }, 4000)
  }

  return (
    <>
      <SectionTitle>Emergency Alert System</SectionTitle>
      
      <DemoNote>Contact emergency services and depot management in urgent situations.</DemoNote>

      <div className={`${card} flex items-center gap-3 border-red-100 bg-red-50/90 text-sm text-red-900`}>
        <span className="text-lg" aria-hidden>
          ⚠️
        </span>
        <span className="font-medium">Use only in genuine emergencies</span>
      </div>

      {/* Emergency Action Buttons */}
      <div className={card}>
        <p className="mb-4 text-xs font-semibold text-cb-text-secondary">Alert to:</p>
        
        <button
          type="button"
          className={`mb-3 w-full rounded-2xl border-0 py-5 text-left text-base font-semibold shadow-sm transition ${
            selectedType === 'Police'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
          }`}
          onClick={() => sendAlert('Police')}
          disabled={alertMsg !== null && selectedType !== 'Police'}
        >
          🚔 Contact Police
          <br />
          <span className="text-xs font-normal opacity-80">Report incident, threat, or accident</span>
        </button>

        <button
          type="button"
          className={`mb-3 w-full rounded-2xl border-0 py-5 text-left text-base font-semibold shadow-sm transition ${
            selectedType === 'Hospital'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
          }`}
          onClick={() => sendAlert('Hospital')}
          disabled={alertMsg !== null && selectedType !== 'Hospital'}
        >
          🏥 Call Ambulance
          <br />
          <span className="text-xs font-normal opacity-80">Medical emergency on bus</span>
        </button>

        <button
          type="button"
          className={`w-full rounded-2xl border-0 py-5 text-left text-base font-semibold shadow-sm transition ${
            selectedType === 'Depot'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
          }`}
          onClick={() => sendAlert('Depot')}
          disabled={alertMsg !== null && selectedType !== 'Depot'}
        >
          🏢 Alert Depot Manager
          <br />
          <span className="text-xs font-normal opacity-80">Operational issue or incident report</span>
        </button>
      </div>

      {/* Alert Status Message */}
      {alertMsg ? (
        <div className={`${card} animate-pulse flex items-center gap-3 border-emerald-200 bg-emerald-50/90 text-sm font-medium text-emerald-900`}>
          <span className="text-lg">✓</span>
          Alert sent to {alertMsg} — Help is on the way (demo)
        </div>
      ) : null}

      {/* Emergency Contacts */}
      <div className={card}>
        <div className="mb-4 text-sm font-semibold text-cb-text">Emergency Contacts</div>
        
        <div className="mb-4 rounded-lg bg-blue-50 p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-blue-900 font-medium">Police</span>
            <span className="font-mono font-bold text-blue-700 text-lg">100</span>
          </div>
          <p className="text-xs text-blue-700">Report accidents, threats, missing persons</p>
        </div>

        <div className="mb-4 rounded-lg bg-emerald-50 p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-emerald-900 font-medium">Ambulance</span>
            <span className="font-mono font-bold text-emerald-700 text-lg">108</span>
          </div>
          <p className="text-xs text-emerald-700">Medical emergencies</p>
        </div>

        <div className="rounded-lg bg-amber-50 p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-amber-900 font-medium">Depot Helpline</span>
            <span className="font-mono font-bold text-amber-700 text-lg">1800-BUS-HELP</span>
          </div>
          <p className="text-xs text-amber-700">CityBus depot management & support</p>
        </div>
      </div>

      {/* GPS & Bus Details */}
      <div className={card}>
        <p className="mb-3 text-sm font-semibold text-cb-text">Location & Bus Information</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-cb-text-secondary">Bus Route</span>
            <span className="font-medium text-cb-text">R1 - University Express</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cb-text-secondary">Bus Number</span>
            <span className="font-medium text-cb-text">CB-5023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cb-text-secondary">Current Location</span>
            <span className="font-medium text-cb-text">12.97°N, 77.60°E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cb-text-secondary">GPS Timestamp</span>
            <span className="font-medium text-cb-text">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className={`${card} border-slate-200 bg-slate-50/50 text-xs text-cb-text-secondary`}>
        <p className="font-medium text-cb-text mb-2">ℹ️ Information</p>
        <p>• All emergency alerts are logged and tracked by CityBus operations</p>
        <p className="mt-1">• Your location is automatically shared with authorities</p>
        <p className="mt-1">• Stay calm, help is being dispatched</p>
      </div>
    </>
  )
}
