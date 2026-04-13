import { useState } from 'react'
import { useDepot } from '../hooks/useDepot'
import { BusCard } from '../components/dashboard/BusCard.jsx'
import { BusManagementModal } from '../components/dashboard/BusManagementModal.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

export function FleetManagement() {
  const { buses, updateBusStatus, updateBusConductor } = useDepot()
  const [selectedBus, setSelectedBus] = useState(null)

  const statusGroups = {
    running: buses.filter((b) => b.status === 'running'),
    idle: buses.filter((b) => b.status === 'idle'),
    maintenance: buses.filter((b) => b.status === 'maintenance'),
  }

  const handleUpdate = (busId, newStatus, driverName, conductorName) => {
    updateBusStatus(busId, newStatus)
    updateBusConductor(busId, conductorName, driverName)
  }

  return (
    <div className="space-y-8">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{statusGroups.running.length}</p>
          <p className="mt-2 text-sm text-gray-600">Running</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-yellow-600">{statusGroups.idle.length}</p>
          <p className="mt-2 text-sm text-gray-600">Idle</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-red-600">{statusGroups.maintenance.length}</p>
          <p className="mt-2 text-sm text-gray-600">Maintenance</p>
        </Card>
      </div>

      {/* Running Buses */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">🟢 Running Buses</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statusGroups.running.map((bus) => (
            <BusCard key={bus.id} bus={bus} onEdit={setSelectedBus} />
          ))}
        </div>
      </div>

      {/* Idle Buses */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">🟡 Idle Buses</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statusGroups.idle.map((bus) => (
            <BusCard key={bus.id} bus={bus} onEdit={setSelectedBus} />
          ))}
        </div>
      </div>

      {/* Maintenance Buses */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">🔴 Maintenance</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statusGroups.maintenance.map((bus) => (
            <BusCard key={bus.id} bus={bus} onEdit={setSelectedBus} />
          ))}
        </div>
      </div>

      {/* Full Fleet Table */}
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Full Fleet Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Bus ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Driver</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Conductor</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Occupancy</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => {
                const occupancyPercent = Math.round((bus.passengerCount / bus.capacity) * 100)
                return (
                  <tr key={bus.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{bus.id}</td>
                    <td className="px-4 py-3 text-gray-600">{bus.route}</td>
                    <td className="px-4 py-3 text-gray-600">{bus.driverName}</td>
                    <td className="px-4 py-3 text-gray-600">{bus.conductorName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {bus.passengerCount}/{bus.capacity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={bus.status === 'running' ? 'success' : bus.status === 'idle' ? 'warning' : 'danger'}
                      >
                        {bus.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedBus(bus)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {selectedBus && (
        <BusManagementModal
          bus={selectedBus}
          buses={buses}
          onClose={() => setSelectedBus(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
