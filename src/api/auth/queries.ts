import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentCardinal, updateCurrentCardinal } from './api'
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

export function useUpdateCurrentCardinalMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCurrentCardinal,
    onSuccess: (result) => {
      queryClient.setQueryData(currentCardinalQueryKey, result.currentCardinal)
      // 기수 탭·등록 기본 기수·회원 역할(YB/OB)이 모두 현재 기수에 기대므로 전체를 다시 받아온다.
      return queryClient.invalidateQueries()
    },
  })
}
