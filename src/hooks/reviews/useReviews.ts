import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addReview, getReviews, type ReviewCreateRequest } from '@api/reviews'
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

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (request: ReviewCreateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return addReview(request, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
    },
  })
}
