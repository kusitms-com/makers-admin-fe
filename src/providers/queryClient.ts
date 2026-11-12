import { QueryClient, type FetchQueryOptions, type QueryKey } from '@tanstack/react-query'
import { ApiError, isNetworkError } from '@api/client'
import { useAuthStore } from '@hooks/auth/useAuth'

// 다시 보내도 결과가 같은 4xx는 재시도하지 않는다. 네트워크 오류와 5xx만 한 번 더 시도한다.
export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 1) return false
  return isNetworkError(error) || (error instanceof ApiError && error.status >= 500)
}

// 라우트 clientLoader와 화면이 같은 캐시를 쓰도록 모듈 하나에서 만든다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

// 목록 라우트 clientLoader에서 쓴다. await하지 않아 데이터를 기다리지 않고 화면을 바로 넘기고,
// 화면의 useQuery가 같은 요청을 이어받는다. loader는 인증 확인(PrivateLayout)보다 먼저 돌 수 있어
// 로그인 상태일 때만 요청한다.
export function prefetchWhenAuthenticated<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  if (useAuthStore.getState().session.status === 'authenticated') {
    void queryClient.prefetchQuery(options)
  }
  return null
}

// 로그인 상태가 풀리면(로그아웃, 리프레시 토큰 거부) 진행 중인 요청을 취소하고 캐시를 비운다.
// 모듈 단위 캐시라 그대로 두면 다음에 로그인한 계정에 이전 계정의 데이터가 보일 수 있다.
useAuthStore.subscribe((state, previous) => {
  if (previous.session.status === 'authenticated' && state.session.status !== 'authenticated') {
    void queryClient.cancelQueries()
    queryClient.clear()
  }
})
