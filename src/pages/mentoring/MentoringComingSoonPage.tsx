import { useLocation, useNavigate } from 'react-router'
import { AlertModal } from '@components/common/AlertModal'
import { Button } from '@components/common/Button'
import { MentoringPage } from './MentoringPage'

// 멘토링 기능은 아직 운영하지 않는다. 기존 화면(목업 데이터)을 배경으로 두고 닫을 수 없는 안내 모달을 띄운다.
export function MentoringComingSoonPage() {
  const navigate = useNavigate()
  const location = useLocation()

  function goBack() {
    // 주소로 바로 들어와 앱 안 이전 기록이 없으면 기본 경로로 보낸다.
    if (location.key === 'default') {
      void navigate('/', { replace: true })
      return
    }
    void navigate(-1)
  }

  return (
    <>
      <MentoringPage />
      <AlertModal open title="아직 준비 중인 기능이에요" description="이전 페이지로 돌아가주세요">
        {/* Figma도 회색(disable 타입) 버튼을 쓰지만 실제로는 누를 수 있어야 한다. */}
        <Button
          variant="disable"
          size="l"
          disabled={false}
          className="w-full cursor-pointer"
          onClick={goBack}
        >
          돌아가기
        </Button>
      </AlertModal>
    </>
  )
}

export default MentoringComingSoonPage
