import { Link } from 'react-router'
import { ErrorFallback } from '@components/common/ErrorFallback'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <ErrorFallback
        title="페이지를 찾을 수 없습니다"
        description="주소가 올바른지 다시 확인해주세요."
      />
      <Link to="/" className="text-label-14sb text-brand-primary hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFoundPage
