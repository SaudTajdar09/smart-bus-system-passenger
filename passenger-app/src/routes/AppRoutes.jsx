import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.jsx'
import { RequireAuth } from './RequireAuth.jsx'
import { Login } from '../pages/Login.jsx'
import { Home } from '../pages/Home.jsx'
import { Book } from '../pages/Book.jsx'
import { Tickets } from '../pages/Tickets.jsx'
import { Track } from '../pages/Track.jsx'
import { Emergency } from '../pages/Emergency.jsx'
import { Account } from '../pages/Account.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/track" element={<Track />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/account" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
