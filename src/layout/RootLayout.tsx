import { Outlet } from 'react-router'
import { Sidebar } from '@/components/common'
import { useToast } from '@hooks/common/useToast'
import { useAuthStore } from '@hooks/auth/useAuth'

export function RootLayout() {
  const logout = useAuthStore((state) => state.logout)
  const addToast = useToast()

  function handleLogout() {
    void logout().catch((error: unknown) => {
      if (error instanceof Error) {
        addToast({ type: 'error', message: '서버 로그아웃을 완료하지 못했습니다.' })
        return
      }
      throw error
    })
  }

  return (
    <div className="bg-fill-netural min-h-screen">
      <Sidebar className="fixed inset-y-0 left-0" onLogout={handleLogout} />
      <main className="pl-sidebar flex min-h-screen flex-col">
        <Outlet />
      </main>
    </div>
  )
}

// src/routes.ts가 파일 기반 라우팅으로 참조하려면 default export가 필요하다.
export default RootLayout
