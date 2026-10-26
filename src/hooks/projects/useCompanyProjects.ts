import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCorporateProject,
  getCorporateProjects,
  type CorporateProjectCreateRequest,
} from '@api/projects'
import { useAuthStore } from '@hooks/auth/useAuth'

export const companyProjectsQueryKey = ['admin', 'projects', 'corporate'] as const

export function useCompanyProjectsQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )

  return useQuery({
    queryKey: companyProjectsQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getCorporateProjects({ accessToken })
    },
    enabled: accessToken !== undefined,
  })
}

export function useCreateCompanyProjectMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )

  return useMutation({
    mutationFn: (request: CorporateProjectCreateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return createCorporateProject(request, { accessToken })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyProjectsQueryKey })
    },
  })
}
