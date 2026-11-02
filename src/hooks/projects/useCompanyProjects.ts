import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCorporateProject,
  deleteCorporateProject,
  getCorporateProject,
  getCorporateProjects,
  updateCorporateProject,
  type CorporateProjectCreateRequest,
  type CorporateProjectUpdateRequest,
} from '@api/projects'
import { useAuthStore } from '@hooks/auth/useAuth'

export const companyProjectsQueryKey = ['admin', 'projects', 'corporate'] as const

export function useCompanyProjectsQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useQuery({
    queryKey: companyProjectsQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getCorporateProjects({ accessToken, refreshAccessToken })
    },
    enabled: accessToken !== undefined,
  })
}

export function useCompanyProjectQuery(id: number | undefined) {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useQuery({
    queryKey: [...companyProjectsQueryKey, id],
    queryFn: () => {
      if (!accessToken || id === undefined) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getCorporateProject(id, { accessToken, refreshAccessToken })
    },
    enabled: accessToken !== undefined && id !== undefined,
  })
}

export function useCreateCompanyProjectMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (request: CorporateProjectCreateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return createCorporateProject(request, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyProjectsQueryKey })
    },
  })
}

export function useUpdateCompanyProjectMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken)

  return useMutation({
    mutationFn: (request: CorporateProjectUpdateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return updateCorporateProject(request, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: companyProjectsQueryKey })
    },
  })
}

export function useDeleteCompanyProjectMutation() {
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
      return deleteCorporateProject(id, { accessToken, refreshAccessToken })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyProjectsQueryKey })
    },
  })
}
