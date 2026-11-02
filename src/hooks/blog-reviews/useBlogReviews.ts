import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addBlogReview,
  deleteBlogReview,
  getBlogReviews,
  updateBlogReview,
  type BlogReviewCreateRequest,
  type BlogReviewUpdateRequest,
} from '@api/blogReviews'
import { useAuthStore } from '@hooks/auth/useAuth'

export const blogReviewsQueryKey = ['admin', 'blog-reviews'] as const

export function useBlogReviewsQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useQuery({
    queryKey: blogReviewsQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getBlogReviews({ accessToken, refreshAccessToken })
    },
    enabled: accessToken !== undefined,
  })
}

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

export function useDeleteBlogReviewMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (id: number) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return deleteBlogReview(id, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: blogReviewsQueryKey })
    },
  })
}

export function useUpdateBlogReviewMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (request: BlogReviewUpdateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return updateBlogReview(request, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: blogReviewsQueryKey })
    },
  })
}
