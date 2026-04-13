import { useDepot } from '../../hooks/useDepot.js'

export function AlertNotificationBox() {
  const { newAlert, alerts: allAlerts, alertStats } = useDepot()
  const activeAlerts = allAlerts.filter((alert) => alert.status === 'active')

  const getAlertColor = (type) => {
    switch (type) {
      case 'Police':
        return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'Hospital':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'Depot':
        return 'bg-amber-50 border-amber-200 text-amber-900'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Police':
        return '🚔'
      case 'Hospital':
        return '🏥'
      case 'Depot':
        return '🏢'
      default:
        return '🚨'
    }
  }

  return (
    <>
      {/* Real-time popup for new alerts */}
      {newAlert && (
        <div className={`fixed top-4 right-4 z-[1000] rounded-2xl border-2 p-4 shadow-2xl max-w-sm animate-bounce ${getAlertColor(newAlert.type)}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="text-3xl">{getAlertIcon(newAlert.type)}</span>
            <span className="font-bold text-lg">⚠️ NEW ALERT</span>
          </div>

          <div className="space-y-2">
            <p className="font-bold">Type: {newAlert.type}</p>
            <p className="font-semibold">Passenger: {newAlert.passengerName}</p>
            <p>Email: {newAlert.passengerEmail}</p>
            <p>Route: {newAlert.route}</p>
            <p className="text-xs opacity-75">Location: {newAlert.location}</p>
            <p className="text-xs opacity-75 font-mono">
              Time: {new Date(newAlert.timestamp).toLocaleTimeString()}
            </p>
            <p className="text-xs opacity-50 font-mono">
              Alert ID: {newAlert.id.split('-')[0]}-...
            </p>
          </div>
        </div>
      )}

      {/* Alert statistics summary */}
      {activeAlerts.length > 0 && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50/90 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-red-900">🚨 Active Alerts Summary</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-red-700">Total Active: <span className="font-bold text-lg">{alertStats.activeAlerts}</span></p>
                </div>
                <div>
                  <p className="text-blue-700">🚔 Police: <span className="font-bold">{alertStats.handleAlerts}</span></p>
                </div>
                <div>
                  <p className="text-emerald-700">🏥 Medical: <span className="font-bold">{alertStats.medicalAlerts}</span></p>
                </div>
                <div>
                  <p className="text-amber-700">🏢 Depot: <span className="font-bold">{alertStats.depotAlerts}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent alerts list */}
          {activeAlerts.length > 0 && (
            <div className="mt-4 max-h-48 overflow-y-auto">
              <p className="mb-2 text-xs font-semibold uppercase text-red-700">Recent Alerts:</p>
              <div className="space-y-2">
                {activeAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg p-2 text-xs border ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{alert.passengerName} - {alert.type}</p>
                        <p className="text-xs opacity-75">Route: {alert.route} | {alert.location}</p>
                      </div>
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
