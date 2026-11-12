import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addReview, deleteReview, getReviews, updateReview } from './api'
import { useIsAuthenticated } from '@hooks/auth/useAuth'

export const reviewKeys = {
  all: ['admin', 'reviews'] as const,
  list: () => [...reviewKeys.all, 'list'] as const,
}

export function reviewsQueryOptions() {
  return queryOptions({ queryKey: reviewKeys.list(), queryFn: () => getReviews() })
}

export function useReviewsQuery() {
  return useQuery({ ...reviewsQueryOptions(), enabled: useIsAuthenticated() })
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}
