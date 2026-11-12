import { meetupProjectsQueryOptions } from '@api/projects/queries'
import { prefetchWhenAuthenticated } from '@/providers/queryClient'

export function clientLoader() {
  return prefetchWhenAuthenticated(meetupProjectsQueryOptions())
}

export { MeetupProjectsPage as default } from '@pages/projects/MeetupProjectsPage'
