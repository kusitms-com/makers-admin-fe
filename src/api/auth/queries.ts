import { useQuery } from '@tanstack/react-query'
import { getCurrentCardinal } from './api'
import { useAuthStore } from '@hooks/auth/useAuth'

export const currentCardinalQueryKey = ['auth', 'current-cardinal'] as const

export function useCurrentCardinalQuery() {
  const isAuthenticated = useAuthStore((state) => state.session.status === 'authenticated')

  return useQuery({
    queryKey: currentCardinalQueryKey,
    queryFn: getCurrentCardinal,
    enabled: isAuthenticated,
  })
}
