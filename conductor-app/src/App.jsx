import { ConductorProvider } from './context/ConductorContext.jsx'
import ConductorRoutes from './routes/ConductorRoutes.jsx'

export default function App() {
  return (
    <ConductorProvider>
      <ConductorRoutes />
    </ConductorProvider>
  )
}
