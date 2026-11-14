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

// 확인 모달을 띄워 둔 사이 다른 OWNER가 기수를 바꿨는지 보려고, 캐시 대신 서버 값을 다시 받는다.
export function useFetchLatestCurrentCardinal() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.fetchQuery({
      queryKey: currentCardinalQueryKey,
      queryFn: getCurrentCardinal,
      staleTime: 0,
    })
}
