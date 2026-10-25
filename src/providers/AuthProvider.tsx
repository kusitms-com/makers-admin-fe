import { useEffect, useRef, type ReactNode } from 'react'
import { useAuthStore } from '@hooks/auth/useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const restore = useAuthStore((state) => state.restore)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      void restore()
    }
  }, [restore])

  return children
}
