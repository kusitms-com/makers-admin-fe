import { useNavigate } from 'react-router'
import { Button } from '@/components/common'
import type { SelectFieldOption } from '@/components/common/SelectField'
import {
  MentoringMemberTable,
  type MentoringMemberRow,
  type MentoringMemberStatus,
} from '@/components/members'

const LIST_STATUS_OPTIONS: SelectFieldOption[] = [
  { value: 'PENDING', label: '대기' },
  { value: 'APPROVED', label: '승인' },
  { value: 'REJECTED', label: '반려' },
]

interface MemberListPresenterProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  onPageChange: (page: number) => void
  onStatusChange: (id: string, status: MentoringMemberStatus) => void
}

export const MemberListPresenter = ({
  members,
  page,
  totalPages,
  totalLabel,
  onPageChange,
  onStatusChange,
}: MemberListPresenterProps) => {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex h-10 items-center justify-between gap-4">
        <nav aria-label="현재 위치" className="text-body-18sb flex items-center gap-2">
          <span className="text-label-normal">회원 관리</span>
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
        statusOptions={LIST_STATUS_OPTIONS}
        onPageChange={onPageChange}
        onStatusChange={onStatusChange}
      />
    </>
  )
}
