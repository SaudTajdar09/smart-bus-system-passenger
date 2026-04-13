import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.jsx'
import { Dashboard } from '../pages/Dashboard.jsx'
import { Scanner } from '../pages/Scanner.jsx'
import { Passengers } from '../pages/Passengers.jsx'
import { Route } from '../pages/Route.jsx'
import { Account } from '../pages/Account.jsx'
import { Emergency } from '../pages/Emergency.jsx'
import { ManualTicket } from '../pages/ManualTicket.jsx'
import { Login } from '../pages/Login.jsx'
import { RequireAuth } from './RequireAuth.jsx'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/scanner', element: <Scanner /> },
      { path: '/passengers', element: <Passengers /> },
      { path: '/route', element: <Route /> },
      { path: '/account', element: <Account /> },
      { path: '/emergency', element: <Emergency /> },
      { path: '/manual-ticket', element: <ManualTicket /> },
    ],
  },
])

export default function ConductorRoutes() {
  return <RouterProvider router={router} />
}
