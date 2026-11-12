import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addBlogReview, deleteBlogReview, getBlogReviews, updateBlogReview } from './api'
import { useIsAuthenticated } from '@hooks/auth/useAuth'

export const blogReviewKeys = {
  all: ['admin', 'blog-reviews'] as const,
  list: () => [...blogReviewKeys.all, 'list'] as const,
}

export function blogReviewsQueryOptions() {
  return queryOptions({ queryKey: blogReviewKeys.list(), queryFn: () => getBlogReviews() })
}

export function useBlogReviewsQuery() {
  return useQuery({ ...blogReviewsQueryOptions(), enabled: useIsAuthenticated() })
}

export function useCreateBlogReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBlogReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: blogReviewKeys.all })
    },
  })
}

export function useDeleteBlogReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBlogReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: blogReviewKeys.all })
    },
  })
}

export function useUpdateBlogReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBlogReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: blogReviewKeys.all })
    },
  })
}
