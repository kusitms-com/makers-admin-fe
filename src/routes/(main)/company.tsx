import { companyProjectsQueryOptions } from '@api/projects/queries'
import { prefetchWhenAuthenticated } from '@/providers/queryClient'

export function clientLoader() {
  return prefetchWhenAuthenticated(companyProjectsQueryOptions())
}

export { CompanyProjectsPage as default } from '@pages/projects/CompanyProjectsPage'
