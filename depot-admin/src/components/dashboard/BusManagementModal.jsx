import { useState, useMemo } from 'react'
import { Card } from '../ui/Card.jsx'
import { Button } from '../ui/Button.jsx'
import { Input } from '../ui/Input.jsx'
import { CONDUCTORS } from '../../data/conductorData.js'

export function BusManagementModal({ bus, buses = [], onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    status: bus.status,
    driverName: bus.driverName,
    conductorName: bus.conductorName,
  })

  // Get available conductors (exclude those assigned to other buses)
  const availableConductors = useMemo(() => {
    const assignedConductors = buses
      .filter((b) => b.id !== bus.id) // Exclude current bus
      .map((b) => b.conductorName)

    return CONDUCTORS.filter((conductor) => !assignedConductors.includes(conductor))
  }, [buses, bus.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(bus.id, formData.status, formData.driverName, formData.conductorName)
    onClose()
  }

  const statusOptions = ['running', 'idle', 'maintenance']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Update Bus: {bus.id}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Route Info */}
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <p className="text-gray-600">Route: <span className="font-semibold text-gray-900">{bus.route}</span></p>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Bus Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Driver Name */}
          <div>
            <Input
              label="Driver Name"
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              placeholder="Enter driver name"
              required
            />
          </div>

          {/* Conductor Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Conductor Name</label>
            <select
              value={formData.conductorName}
              onChange={(e) => setFormData({ ...formData, conductorName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a conductor</option>
              {availableConductors.map((conductor) => (
                <option key={conductor} value={conductor}>
                  {conductor}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Update Bus
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
