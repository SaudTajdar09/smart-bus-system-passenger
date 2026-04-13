import { useDepot } from '../hooks/useDepot'
import { IncidentCard } from '../components/dashboard/IncidentCard.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

export function Incidents() {
  const { incidents, resolveIncident, stats } = useDepot()

  const pendingIncidents = incidents.filter((inc) => inc.status === 'pending')
  const resolvedIncidents = incidents.filter((inc) => inc.status === 'resolved')

  const incidentTypes = {
    SOS: incidents.filter((inc) => inc.type === 'SOS').length,
    Breakdown: incidents.filter((inc) => inc.type === 'Breakdown').length,
    Complaint: incidents.filter((inc) => inc.type === 'Complaint').length,
  }

  return (
    <div className="space-y-8">
      {/* Alert Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <p className="text-3xl font-bold text-red-600">{stats.pendingIncidents}</p>
          <p className="mt-2 text-sm text-red-700">Pending Alerts</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-orange-600">{incidentTypes.SOS}</p>
          <p className="mt-2 text-sm text-gray-600">SOS Emergencies</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-green-600">{resolvedIncidents.length}</p>
          <p className="mt-2 text-sm text-gray-600">Resolved</p>
        </Card>
      </div>

      {/* Incident Type Breakdown */}
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Incident Types</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">SOS Emergencies</span>
              <span className="font-bold text-orange-600">{incidentTypes.SOS}</span>
            </div>
            <div className="h-3 bg-orange-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600"
                style={{ width: `${(incidentTypes.SOS / Math.max(...Object.values(incidentTypes), 1)) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Breakdowns</span>
              <span className="font-bold text-red-600">{incidentTypes.Breakdown}</span>
            </div>
            <div className="h-3 bg-red-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600"
                style={{ width: `${(incidentTypes.Breakdown / Math.max(...Object.values(incidentTypes), 1)) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Complaints</span>
              <span className="font-bold text-yellow-600">{incidentTypes.Complaint}</span>
            </div>
            <div className="h-3 bg-yellow-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-600"
                style={{ width: `${(incidentTypes.Complaint / Math.max(...Object.values(incidentTypes), 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Pending Incidents */}
      {pendingIncidents.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-red-600">🚨 Pending Incidents</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pendingIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} onResolve={resolveIncident} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved Incidents */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-green-600">✓ Resolved Incidents</h3>
        {resolvedIncidents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {resolvedIncidents.map((incident) => (
              <Card key={incident.id} className="p-4 opacity-60">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{incident.type}</p>
                      <p className="text-xs text-gray-600 mt-1">{incident.description}</p>
                    </div>
                    <Badge variant="success">Resolved</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{incident.busId}</span>
                    <span>{Math.floor((Date.now() - new Date(incident.timestamp).getTime()) / 60000)} mins ago</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500">No resolved incidents yet</p>
          </Card>
        )}
      </div>

      {/* All Incidents Table */}
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900">All Incidents Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Bus ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => {
                const timeAgo = Math.floor((Date.now() - new Date(incident.timestamp).getTime()) / 60000)
                return (
                  <tr key={incident.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{incident.type}</td>
                    <td className="px-4 py-3 text-gray-600">{incident.busId}</td>
                    <td className="px-4 py-3 text-gray-600">{incident.description}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{timeAgo} mins</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={incident.status === 'pending' ? 'warning' : 'success'}>
                        {incident.status}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
