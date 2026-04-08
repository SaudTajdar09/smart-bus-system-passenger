import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { TicketsProvider } from './context/TicketsContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketsProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </TicketsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
