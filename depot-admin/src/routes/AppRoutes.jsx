import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { Login } from '../pages/Login.jsx'
import { Dashboard } from '../pages/Dashboard.jsx'
import { Analytics } from '../pages/Analytics.jsx'
import { FleetManagement } from '../pages/FleetManagement.jsx'
import { LiveTracking } from '../pages/LiveTracking.jsx'
import { Incidents } from '../pages/Incidents.jsx'
import { Routes as RoutesPage } from '../pages/Routes.jsx'

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Analytics />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FleetManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LiveTracking />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Incidents />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/routes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoutesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
