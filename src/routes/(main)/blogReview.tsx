import { blogReviewsQueryOptions } from '@api/blog-reviews/queries'
import { prefetchWhenAuthenticated } from '@/providers/queryClient'

export function clientLoader() {
  return prefetchWhenAuthenticated(blogReviewsQueryOptions())
}

export { BlogReviewsPage as default } from '@pages/blog-reviews/BlogReviewsPage'
