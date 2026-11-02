import { useQuery } from '@tanstack/react-query'
import { getReviews } from '@api/reviews'
import { useAuthStore } from '@hooks/auth/useAuth'

export const reviewsQueryKey = ['admin', 'reviews'] as const

export function useReviewsQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useQuery({
    queryKey: reviewsQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getReviews({ accessToken, refreshAccessToken })
    },
    enabled: accessToken !== undefined,
  })
}
