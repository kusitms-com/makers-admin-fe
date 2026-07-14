import { Outlet } from 'react-router'
import { Sidebar } from '@/components/common'

export function RootLayout() {
  return (
    <div className="bg-fill-netural min-h-screen">
      <Sidebar className="fixed inset-y-0 left-0" />
      <div className="flex min-h-screen flex-col pl-[220px]">
        <main className="flex flex-1 flex-col gap-7 pt-6 pr-8 pb-[60px] pl-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
