import { introductionQueryOptions } from '@api/introductions/queries'
import { prefetchWhenAuthenticated } from '@/providers/queryClient'

export function clientLoader() {
  return prefetchWhenAuthenticated(introductionQueryOptions())
}

export { IntroductionsPage as default } from '@pages/introductions/IntroductionsPage'
