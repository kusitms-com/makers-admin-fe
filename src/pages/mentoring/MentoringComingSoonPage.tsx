import { PageHeader } from '@components/common/PageHeader'

// 멘토링 기능은 아직 운영하지 않는다. MentoringPage 구현은 남겨두고 라우트만 이 화면으로 연결한다.
export function MentoringComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="멘토링 관리" />
      <p className="text-body-16sb text-label-alternative flex flex-1 items-center justify-center">
        준비중입니다
      </p>
    </div>
  )
}

export default MentoringComingSoonPage
