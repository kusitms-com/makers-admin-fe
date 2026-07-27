import { useNavigate } from 'react-router'
import { Button } from '@/components/common'
import {
  MentoringMemberTable,
  type MentoringMemberRow,
  type MentoringMemberStatus,
} from '@/components/members'

interface MemberListPresenterProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  onPageChange: (page: number) => void
  onStatusChange: (id: string, status: MentoringMemberStatus) => void
  onDelete: (id: string) => void
}

export function MemberListPresenter({
  members,
  page,
  totalPages,
  totalLabel,
  onPageChange,
  onStatusChange,
  onDelete,
}: MemberListPresenterProps) {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex h-10 items-center justify-between gap-4">
        <nav aria-label="현재 위치" className="text-body-18sb flex items-center gap-2">
          <span className="text-label-normal">회원 관리</span>
          <span className="text-label-assitive" aria-hidden="true">
            ›
          </span>
          <span className="text-label-alternative">회원가입 승인</span>
        </nav>
        <Button
          variant="strong"
          size="m"
          onClick={() => {
            void navigate('/members/approval')
          }}
        >
          승인 요청 3
        </Button>
      </div>
      <MentoringMemberTable
        members={members}
        page={page}
        totalPages={totalPages}
        totalLabel={totalLabel}
        onPageChange={onPageChange}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </>
  )
}
