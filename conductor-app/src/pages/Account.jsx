import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SectionTitle } from '../components/common/SectionTitle'
import { CURRENT_CONDUCTOR, CONDUCTOR_ROUTES } from '../data/conductorData'
import { useConductor } from '../hooks/useConductor'
import { useNavigate } from 'react-router-dom'

export function Account() {
  const { currentRoute } = useConductor()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('conductorAuth')
    navigate('/login', { replace: true })
  }
  
  const getCurrentRouteDetails = () => {
    return CONDUCTOR_ROUTES.find(r => r.id === currentRoute)
  }

  const route = getCurrentRouteDetails()

  const stats = [
    { label: 'Total Shifts', value: '145' },
    { label: 'Avg Rating', value: '4.8' },
    { label: 'On-Time %', value: '98%' },
  ]

  const documents = [
    { name: 'Driving License', status: 'verified' },
    { name: 'ID Card', status: 'verified' },
    { name: 'Background Check', status: 'verified' },
  ]

  return (
    <div className="pb-6">
      {/* Header Profile Card */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-8 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">{CURRENT_CONDUCTOR.name}</h1>
              <p className="text-blue-100">Badge: {CURRENT_CONDUCTOR.badge}</p>
              <Badge variant="success" className="mt-2">
                ✓ Active Conductor
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Personal Information */}
        <Card className="p-6">
          <SectionTitle>👤 Personal Information</SectionTitle>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Full Name</span>
              <span className="font-semibold">{CURRENT_CONDUCTOR.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Conductor ID</span>
              <span className="font-semibold">{CURRENT_CONDUCTOR.id}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Badge Number</span>
              <span className="font-semibold">{CURRENT_CONDUCTOR.badge}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>

        {/* Work Information */}
        <Card className="p-6">
          <SectionTitle>💼 Work Information</SectionTitle>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Current Shift</span>
              <Badge variant="info">{CURRENT_CONDUCTOR.shift}</Badge>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Assigned Route</span>
              <span className="font-semibold text-sm">{route?.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Route Type</span>
              <Badge variant="warning">{route?.type}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bus Capacity</span>
              <span className="font-semibold bg-blue-50 px-3 py-1 rounded-full text-sm">
                {route?.capacity} Seats
              </span>
            </div>
          </div>
        </Card>

        {/* Performance Statistics */}
        <Card className="p-6">
          <SectionTitle>📊 Performance Stats</SectionTitle>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Route Stops */}
        {route && (
          <Card className="p-6">
            <SectionTitle>🗺️ Route Stops</SectionTitle>
            <div className="mt-4 space-y-2">
              {route.stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{stop}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Documents & Verification */}
        <Card className="p-6">
          <SectionTitle>📋 Documents</SectionTitle>
          <div className="mt-4 space-y-3">
            {documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{doc.name}</span>
                <Badge variant="success">✓ {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <SectionTitle>📞 Contact Information</SectionTitle>
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Email</p>
              <p className="font-semibold">rajesh.kumar@smartbus.com</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Phone</p>
              <p className="font-semibold">+91 98765 43210</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Emergency Contact</p>
              <p className="font-semibold">+91 98765 43211</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="primary" className="w-full">
            📋 Edit Profile
          </Button>
          <Button variant="secondary" className="w-full">
            🔐 Change Password
          </Button>
          <Button variant="danger" className="w-full" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>Smart Bus System™</p>
          <p>Version 1.0.0 | Last Updated: 11 Apr 2026</p>
        </div>
      </div>
    </div>
  )
}
