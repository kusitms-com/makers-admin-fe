import { Outlet } from 'react-router'
import { Sidebar } from '@/components/common'

export function RootLayout() {
  return (
    <div className="bg-fill-netural min-h-screen">
      <Sidebar className="fixed inset-y-0 left-0" />
      <main className="pl-sidebar flex min-h-screen flex-col">
        <Outlet />
      </main>
    </div>
  )
}

// src/routes.ts가 파일 기반 라우팅으로 참조하려면 default export가 필요하다.
export default RootLayout
