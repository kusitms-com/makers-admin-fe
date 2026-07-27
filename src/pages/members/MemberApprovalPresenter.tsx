import { Link } from 'react-router'
import { Button } from '@/components/common'
import {
  MentoringMemberTable,
  type MentoringMemberRow,
  type MentoringMemberStatus,
} from '@/components/members'

interface MemberApprovalPresenterProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  onPageChange: (page: number) => void
  onStatusChange: (id: string, status: MentoringMemberStatus) => void
  onDelete: (id: string) => void
}

export function MemberApprovalPresenter({
  members,
  page,
  totalPages,
  totalLabel,
  onPageChange,
  onStatusChange,
  onDelete,
}: MemberApprovalPresenterProps) {
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
        {/* TODO: 승인 상태 저장 API 연동 후 성공 토스트를 표시하고 회원 관리 목록으로 이동한다. */}
        <Button variant="strong" size="m">
          저장하기
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
