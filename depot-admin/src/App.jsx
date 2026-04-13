import { DepotAuthProvider } from './context/DepotAuthContext.jsx'
import { DepotProvider } from './context/DepotContext.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <DepotAuthProvider>
      <DepotProvider>
        <AppRoutes />
      </DepotProvider>
    </DepotAuthProvider>
  )
}
