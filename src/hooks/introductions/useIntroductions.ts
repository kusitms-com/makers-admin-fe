import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateIntroduction, type IntroUpdateRequest } from '@api/introductions'
import { useAuthStore } from '@hooks/auth/useAuth'

export const introductionsQueryKey = ['admin', 'introductions'] as const

export function useUpdateIntroductionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )

  return useMutation({
    mutationFn: (payload: IntroUpdateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return updateIntroduction(payload, { accessToken })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: introductionsQueryKey })
    },
  })
}
