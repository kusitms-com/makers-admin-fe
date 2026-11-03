import { useNavigate } from 'react-router'
import { Button } from '@/components/common'
import { MentoringMemberTable, type MentoringMemberRow } from '@/components/members'

interface MemberListPresenterProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  pendingApprovalCount: number
  onPageChange: (page: number) => void
}

export const MemberListPresenter = ({
  members,
  page,
  totalPages,
  totalLabel,
  pendingApprovalCount,
  onPageChange,
}: MemberListPresenterProps) => {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex h-10 items-center justify-between gap-4">
        <nav aria-label="현재 위치" className="text-body-18sb flex items-center gap-2">
          <span className="text-label-normal">회원 관리</span>
        </nav>
        <Button
          variant={pendingApprovalCount === 0 ? 'disable' : 'strong'}
          size="m"
          onClick={() => {
            void navigate('/members/approval')
          }}
        >
          승인 요청 {pendingApprovalCount}
        </Button>
      </div>
      <MentoringMemberTable
        members={members}
        page={page}
        totalPages={totalPages}
        totalLabel={totalLabel}
        onPageChange={onPageChange}
      />
    </>
  )
}
