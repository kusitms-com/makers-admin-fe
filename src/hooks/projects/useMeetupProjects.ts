import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMeetupProject,
  getMeetupProjects,
  type MeetupProjectCreateRequest,
} from '@api/projects'
import { useAuthStore } from '@hooks/auth/useAuth'

export const meetupProjectsQueryKey = ['admin', 'projects', 'meetup'] as const

export function useMeetupProjectsQuery() {
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )

  return useQuery({
    queryKey: meetupProjectsQueryKey,
    queryFn: () => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return getMeetupProjects({ accessToken })
    },
    enabled: accessToken !== undefined,
  })
}

export function useCreateMeetupProjectMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) =>
    state.session.status === 'authenticated' ? state.session.accessToken : undefined,
  )

  return useMutation({
    mutationFn: (request: MeetupProjectCreateRequest) => {
      if (!accessToken) {
        return Promise.reject(new Error('로그인이 필요합니다.'))
      }
      return createMeetupProject(request, { accessToken })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetupProjectsQueryKey })
    },
  })
}
