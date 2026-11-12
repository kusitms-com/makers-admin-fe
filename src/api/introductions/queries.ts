import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getIntroduction, updateIntroduction } from './api'
import { useIsAuthenticated } from '@hooks/auth/useAuth'

export const introductionKeys = {
  all: ['admin', 'introductions'] as const,
  detail: () => [...introductionKeys.all, 'detail'] as const,
}

export function introductionQueryOptions() {
  return queryOptions({ queryKey: introductionKeys.detail(), queryFn: () => getIntroduction() })
}

export function useIntroductionQuery() {
  return useQuery({ ...introductionQueryOptions(), enabled: useIsAuthenticated() })
}

export function useUpdateIntroductionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateIntroduction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: introductionKeys.all })
    },
  })
}
