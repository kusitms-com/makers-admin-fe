import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

// /는 /introduction으로 이동하고, 정의되지 않은 경로는 not-found로 처리한다.
export default [
  layout('layout/RootLayout.tsx', [
    index('routes/(main)/index.tsx'),
    route('introduction', 'routes/(main)/introduction.tsx'),
    route('meetup', 'routes/(main)/meetup.tsx'),
    route('company', 'routes/(main)/company.tsx'),
    route('review', 'routes/(main)/review.tsx'),
    route('blog-review', 'routes/(main)/blogReview.tsx'),
    route('members', 'routes/(main)/members.tsx'),
    route('members/approval', 'routes/(main)/memberApprovals.tsx'),
    route('*', 'routes/(main)/notFound.tsx'),
  ]),
] satisfies RouteConfig
