import { reviewsQueryOptions } from '@api/reviews/queries'
import { prefetchWhenAuthenticated } from '@/providers/queryClient'

export function clientLoader() {
  return prefetchWhenAuthenticated(reviewsQueryOptions())
}

export { ReviewsPage as default } from '@pages/reviews/ReviewsPage'
