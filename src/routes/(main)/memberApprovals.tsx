import { membersQueryOptions, pendingMembersQueryOptions } from '@api/members/queries'
import { prefetchWhenAuthenticated } from '@/providers/queryClient'

export function clientLoader() {
  prefetchWhenAuthenticated(membersQueryOptions())
  return prefetchWhenAuthenticated(pendingMembersQueryOptions())
}

export { MentoringMembersPage as default } from '@pages/members/MembersPage'
