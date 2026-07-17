import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ErrorFallback } from '@components/common/ErrorFallback'

export function GlobalErrorPage() {
  const error = useRouteError()
  const isKnownRouteError = isRouteErrorResponse(error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-20">
      <ErrorFallback
        title={
          isKnownRouteError
            ? `오류가 발생했습니다 (${String(error.status)})`
            : '문제가 발생했습니다'
        }
        description={isKnownRouteError ? error.statusText : '잠시 후 다시 시도해주세요.'}
      />
    </div>
  )
}
