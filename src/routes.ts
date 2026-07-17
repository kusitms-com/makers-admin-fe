import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

// 구현된 페이지가 /review뿐이라 나머지는 임시로 not-found로 빠진다.
export default [
  layout('layout/RootLayout.tsx', [
    index('routes/(main)/index.tsx'),
    route('review', 'routes/(main)/review.tsx'),
    route('*', 'routes/(main)/notFound.tsx'),
  ]),
] satisfies RouteConfig
