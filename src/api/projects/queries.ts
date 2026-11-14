import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIsAuthenticated } from '@hooks/auth/useAuth'
import {
  createCorporateProject,
  createMeetupProject,
  deleteCorporateProject,
  deleteMeetupProject,
  getCorporateProject,
  getCorporateProjects,
  getMeetupProject,
  getMeetupProjects,
  updateCorporateProject,
  updateMeetupProject,
} from './api'

export const meetupProjectKeys = {
  all: ['admin', 'projects', 'meetup'] as const,
  list: () => [...meetupProjectKeys.all, 'list'] as const,
  detail: (id: number) => [...meetupProjectKeys.all, 'detail', id] as const,
}

export function meetupProjectsQueryOptions() {
  return queryOptions({ queryKey: meetupProjectKeys.list(), queryFn: () => getMeetupProjects() })
}

export function useMeetupProjectsQuery() {
  return useQuery({ ...meetupProjectsQueryOptions(), enabled: useIsAuthenticated() })
}

export function useMeetupProjectQuery(id: number | undefined) {
  const isAuthenticated = useIsAuthenticated()

  return useQuery({
    queryKey: meetupProjectKeys.detail(id ?? 0),
    queryFn: () => getMeetupProject(id ?? 0),
    enabled: isAuthenticated && id !== undefined,
  })
}

export function useCreateMeetupProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMeetupProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetupProjectKeys.all })
    },
  })
}

export function useUpdateMeetupProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMeetupProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: meetupProjectKeys.all })
    },
  })
}

export function useDeleteMeetupProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMeetupProject,
    onSuccess: (_, id) => {
      // 다시 조회한 응답을 기다리지 않고 삭제한 항목을 바로 목록에서 뺀다.
      queryClient.setQueryData(meetupProjectsQueryOptions().queryKey, (data) => {
        if (!data) return data
        const meetupList = data.meetup_list.filter((item) => item.meetup_id !== id)
        return { ...data, meetup_count: meetupList.length, meetup_list: meetupList }
      })
      void queryClient.invalidateQueries({ queryKey: meetupProjectKeys.all })
    },
  })
}

export const companyProjectKeys = {
  all: ['admin', 'projects', 'corporate'] as const,
  list: () => [...companyProjectKeys.all, 'list'] as const,
  detail: (id: number) => [...companyProjectKeys.all, 'detail', id] as const,
}

export function companyProjectsQueryOptions() {
  return queryOptions({
    queryKey: companyProjectKeys.list(),
    queryFn: () => getCorporateProjects(),
  })
}

export function useCompanyProjectsQuery() {
  return useQuery({ ...companyProjectsQueryOptions(), enabled: useIsAuthenticated() })
}

export function useCompanyProjectQuery(id: number | undefined) {
  const isAuthenticated = useIsAuthenticated()

  return useQuery({
    queryKey: companyProjectKeys.detail(id ?? 0),
    queryFn: () => getCorporateProject(id ?? 0),
    enabled: isAuthenticated && id !== undefined,
  })
}

export function useCreateCompanyProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCorporateProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyProjectKeys.all })
    },
  })
}

export function useUpdateCompanyProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCorporateProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: companyProjectKeys.all })
    },
  })
}

export function useDeleteCompanyProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCorporateProject,
    onSuccess: (_, id) => {
      // 다시 조회한 응답을 기다리지 않고 삭제한 항목을 바로 목록에서 뺀다.
      queryClient.setQueryData(companyProjectsQueryOptions().queryKey, (data) => {
        if (!data) return data
        const corporateList = data.corporateList.filter((item) => item.corporate_id !== id)
        return { ...data, corporateCount: corporateList.length, corporateList }
      })
      void queryClient.invalidateQueries({ queryKey: companyProjectKeys.all })
    },
  })
}
