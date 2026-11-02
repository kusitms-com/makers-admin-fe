import { useQuery } from '@tanstack/react-query'
import { getCurrentCardinal } from '@api/auth'

export const currentCardinalQueryKey = ['auth', 'current-cardinal'] as const

export function useCurrentCardinalQuery() {
  return useQuery({
    queryKey: currentCardinalQueryKey,
    queryFn: getCurrentCardinal,
  })
}
