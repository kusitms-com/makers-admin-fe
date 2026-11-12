import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveMember, getMembers, getPendingMembers, rejectMember } from './api'
import { useIsAuthenticated } from '@hooks/auth/useAuth'

export const memberKeys = {
  all: ['admin', 'members'] as const,
  approved: () => [...memberKeys.all, 'approved'] as const,
  pending: () => [...memberKeys.all, 'pending'] as const,
}

export function membersQueryOptions() {
  return queryOptions({ queryKey: memberKeys.approved(), queryFn: () => getMembers('APPROVED') })
}

export function pendingMembersQueryOptions() {
  return queryOptions({ queryKey: memberKeys.pending(), queryFn: () => getPendingMembers() })
}

export function useMembersQuery() {
  return useQuery({ ...membersQueryOptions(), enabled: useIsAuthenticated() })
}

export function usePendingMembersQuery() {
  return useQuery({ ...pendingMembersQueryOptions(), enabled: useIsAuthenticated() })
}

// 승인·반려는 승인 목록과 대기 목록을 모두 바꾸므로 회원 쿼리 전체를 갱신한다.
export function useApproveMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveMember,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: memberKeys.all })
    },
  })
}

export function useRejectMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectMember,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: memberKeys.all })
    },
  })
}
