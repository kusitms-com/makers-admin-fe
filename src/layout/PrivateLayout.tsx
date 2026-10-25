import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@hooks/auth/useAuth'

export function PrivateLayout() {
  const session = useAuthStore((state) => state.session)

  if (session.status === 'loading') {
    return <p role="status">로그인 상태를 확인하고 있습니다.</p>
  }
  if (session.status === 'guest') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateLayout
