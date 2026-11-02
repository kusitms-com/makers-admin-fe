import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveMember, getMembers, getPendingMembers, rejectMember } from '@api/members'
import { useAuthStore } from '@hooks/auth/useAuth'

export const membersQueryKey = ['admin', 'members'] as const
export const pendingMembersQueryKey = ['admin', 'members', 'pending'] as const

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

export function usePendingMembersQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useQuery({
    queryKey: pendingMembersQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getPendingMembers({ accessToken, refreshAccessToken })
    },
    enabled: accessToken !== undefined,
  })
}

export function useApproveMemberMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (userId: number) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return approveMember(userId, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: membersQueryKey })
    },
  })
}

export function useRejectMemberMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (userId: number) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return rejectMember(userId, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: membersQueryKey })
    },
  })
}
