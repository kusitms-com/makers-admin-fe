import { useQuery } from '@tanstack/react-query'
import { getMembers } from '@api/members'
import { useAuthStore } from '@hooks/auth/useAuth'

export const membersQueryKey = ['admin', 'members'] as const

export function useMembersQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useQuery({
    queryKey: membersQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getMembers({ accessToken, refreshAccessToken })
    },
    enabled: accessToken !== undefined,
  })
}
