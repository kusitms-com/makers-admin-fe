import { Outlet } from 'react-router'
import { Sidebar } from '@/components/common'

export function RootLayout() {
  return (
    <div className="bg-fill-netural min-h-screen">
      <Sidebar className="fixed inset-y-0 left-0" />
      <main className="flex min-h-screen flex-col pl-[220px]">
        <Outlet />
      </main>
    </div>
  )
}
