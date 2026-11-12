import type { ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { LoadingState } from '@components/common/LoadingState'
import { GlobalErrorPage } from '@pages/errors/GlobalErrorPage'
import { AuthProvider } from '@/providers/AuthProvider'
import { ConfirmProvider } from '@/providers/ConfirmProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import './index.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* robots.txt만으로는 외부 링크된 주소가 검색 결과에 남을 수 있어 색인 자체를 막는다. */}
        <meta name="robots" content="noindex, nofollow" />
        <title>kusitms_admin</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <Outlet />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

// 목록 라우트에 clientLoader가 있어 SPA 첫 진입 때 loader가 끝날 때까지 보여 준다.
export function HydrateFallback() {
  return <LoadingState className="min-h-screen" />
}

export function ErrorBoundary() {
  return <GlobalErrorPage />
}
