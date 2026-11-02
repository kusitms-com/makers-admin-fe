import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBlogReview, type BlogReviewCreateRequest } from '@api/blogReviews'
import { useAuthStore } from '@hooks/auth/useAuth'

export const blogReviewsQueryKey = ['admin', 'blog-reviews'] as const

export function useCreateBlogReviewMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (request: BlogReviewCreateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return addBlogReview(request, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: blogReviewsQueryKey })
    },
  })
}
