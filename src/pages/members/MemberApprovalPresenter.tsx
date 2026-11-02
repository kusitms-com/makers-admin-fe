import { Link } from 'react-router'
import { Button } from '@/components/common'
import type { SelectFieldOption } from '@/components/common/SelectField'
import {
  MentoringMemberTable,
  type MentoringMemberRow,
  type MentoringMemberStatus,
} from '@/components/members'

const APPROVAL_STATUS_OPTIONS: SelectFieldOption[] = [
  { value: 'PENDING', label: '대기' },
  { value: 'APPROVED', label: '완료' },
  { value: 'REJECTED', label: '거절' },
]

interface MemberApprovalPresenterProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  hasChanges: boolean
  isSaving: boolean
  onPageChange: (page: number) => void
  onStatusChange: (id: string, status: MentoringMemberStatus) => void
  onDelete: (id: string) => void
  onSave: () => void
}

export const MemberApprovalPresenter = ({
  members,
  page,
  totalPages,
  totalLabel,
  hasChanges,
  isSaving,
  onPageChange,
  onStatusChange,
  onDelete,
  onSave,
}: MemberApprovalPresenterProps) => {
  return (
    <>
      <div className="flex h-10 items-center justify-between gap-4">
        <nav aria-label="현재 위치" className="text-body-18sb flex items-center gap-2">
          <Link to="/members" className="text-label-normal hover:underline">
            회원 관리
          </Link>
          <span className="text-label-assitive" aria-hidden="true">
            ›
          </span>
          <span className="text-label-alternative">회원가입 승인</span>
        </nav>
        <Button
          variant={hasChanges && !isSaving ? 'strong' : 'disable'}
          size="m"
          disabled={!hasChanges || isSaving}
          onClick={onSave}
        >
          저장하기
        </Button>
      </div>
      <MentoringMemberTable
        members={members}
        page={page}
        totalPages={totalPages}
        totalLabel={totalLabel}
        statusOptions={APPROVAL_STATUS_OPTIONS}
        isApprovalView
        onPageChange={onPageChange}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </>
  )
}
