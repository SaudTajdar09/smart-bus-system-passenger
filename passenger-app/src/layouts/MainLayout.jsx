import { Outlet } from 'react-router-dom'
import { Topbar } from '../components/layout/Topbar.jsx'
import { BottomNav } from '../components/layout/BottomNav.jsx'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col pb-[88px]">
      <Topbar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 sm:max-w-xl md:max-w-2xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
