import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import dayjs from 'dayjs'
import type { AdminMemberResponse, PendingMemberResponse } from '@api/members'
import { Button, PageHeader } from '@/components/common'
import type { PartBadgeType } from '@/components/common/PartBadge'
import { type MentoringMemberRow, type MentoringMemberStatus } from '@/components/members'
import { useToast } from '@hooks/common/useToast'
import {
  useApproveMemberMutation,
  useMembersQuery,
  usePendingMembersQuery,
  useRejectMemberMutation,
} from '@hooks/members/useMembers'
import { MemberApprovalPresenter } from './MemberApprovalPresenter'
import { MemberListPresenter } from './MemberListPresenter'

const PAGE_SIZE = 8

const PART_BADGE_MAP: Record<NonNullable<AdminMemberResponse['part']>, PartBadgeType> = {
  PLANNER: 'PLAN',
  DESIGNER: 'DE',
  FRONTEND: 'FE',
  BACKEND: 'BE',
}

function toMemberRow(member: AdminMemberResponse): MentoringMemberRow {
  return {
    id: String(member.userId),
    name: member.name ?? '-',
    generation: member.cardinal ?? undefined,
    part: member.part ? PART_BADGE_MAP[member.part] : undefined,
    phone: member.phone ?? '-',
    email: member.email ?? '-',
    registeredAt: member.createdAt ? dayjs(member.createdAt).format('YY.MM.DD HH:mm') : '-',
    status: member.status ?? undefined,
  }
}

// PendingMemberResponse(Swagger)에는 email/가입일 정보가 없어 '-'로 표시한다.
function toPendingMemberRow(member: PendingMemberResponse): MentoringMemberRow {
  return {
    id: String(member.userId),
    name: member.name,
    generation: member.cardinal,
    part: PART_BADGE_MAP[member.part],
    phone: member.phone,
    email: '-',
    registeredAt: '-',
    status: 'PENDING',
    remark: member.certificateImageUrl.split('/').pop(),
  }
}

export const MentoringMembersPage = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const addToast = useToast()
  const isApprovalPage = pathname === '/members/approval'
  const membersQuery = useMembersQuery()
  const pendingMembersQuery = usePendingMembersQuery()
  const approveMemberMutation = useApproveMemberMutation()
  const rejectMemberMutation = useRejectMemberMutation()
  const members = (membersQuery.data ?? []).map(toMemberRow)
  // 승인 대기 목록은 "저장하기"를 누르기 전까지 상태 변경을 화면에서만 반영한다.
  const [approvalEdits, setApprovalEdits] = useState<Record<string, Partial<MentoringMemberRow>>>(
    {},
  )
  const [isSavingApprovals, setIsSavingApprovals] = useState(false)
  const approvals = (pendingMembersQuery.data ?? [])
    .map(toPendingMemberRow)
    .map((member) => ({ ...member, ...approvalEdits[member.id] }))
  const [membersPage, setMembersPage] = useState(1)
  const [approvalPage, setApprovalPage] = useState(1)
  const currentMembers = isApprovalPage ? approvals : members
  const activeQuery = isApprovalPage ? pendingMembersQuery : membersQuery
  const page = isApprovalPage ? approvalPage : membersPage
  const setPage = isApprovalPage ? setApprovalPage : setMembersPage
  const totalPages = Math.max(1, Math.ceil(currentMembers.length / PAGE_SIZE))
  const pagedMembers = currentMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const changedApprovalEntries = Object.entries(approvalEdits).filter(
    (entry): entry is [string, { status: 'APPROVED' | 'REJECTED' }] =>
      entry[1].status === 'APPROVED' || entry[1].status === 'REJECTED',
  )

  function handleApprovalStatusChange(id: string, status: MentoringMemberStatus) {
    setApprovalEdits((current) => ({ ...current, [id]: { ...current[id], status } }))
  }

  async function handleSaveApprovals() {
    if (changedApprovalEntries.length === 0) {
      return
    }

    const hasRejected = changedApprovalEntries.some(([, edit]) => edit.status === 'REJECTED')
    if (
      hasRejected &&
      !window.confirm('반려로 선택한 회원은 계정이 삭제됩니다. 저장하시겠습니까?')
    ) {
      return
    }

    setIsSavingApprovals(true)
    const results = await Promise.allSettled(
      changedApprovalEntries.map(([id, edit]) =>
        edit.status === 'APPROVED'
          ? approveMemberMutation.mutateAsync(Number(id))
          : rejectMemberMutation.mutateAsync(Number(id)),
      ),
    )
    setIsSavingApprovals(false)

    if (results.some((result) => result.status === 'rejected')) {
      addToast({ type: 'error', message: '일부 회원 처리에 실패했습니다. 다시 시도해주세요.' })
      return
    }

    setApprovalEdits({})
    addToast({ type: 'complete', message: '승인 처리가 완료됐습니다.' })
    void navigate('/members')
  }

  if (activeQuery.isLoading) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col">
        <PageHeader title="회원 관리" />
        <div className="text-label-14m text-label-alternative flex min-w-0 flex-1 items-center justify-center">
          불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (activeQuery.isError) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col">
        <PageHeader title="회원 관리" />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3">
          <p className="text-label-14m text-label-alternative">회원 목록을 불러오지 못했습니다.</p>
          <Button
            variant="primary"
            size="s"
            onClick={() => {
              void activeQuery.refetch()
            }}
          >
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <PageHeader title="회원 관리" />

      <div className="flex min-w-0 flex-1 flex-col gap-3 px-8 pt-7 pb-15">
        {isApprovalPage ? (
          <MemberApprovalPresenter
            members={pagedMembers}
            page={page}
            totalPages={totalPages}
            totalLabel={`총 ${String(approvals.length)}명`}
            hasChanges={changedApprovalEntries.length > 0}
            isSaving={isSavingApprovals}
            onPageChange={setPage}
            onStatusChange={handleApprovalStatusChange}
            onSave={() => {
              void handleSaveApprovals()
            }}
          />
        ) : (
          <MemberListPresenter
            members={pagedMembers}
            page={page}
            totalPages={totalPages}
            totalLabel={`총 ${String(members.length)}명`}
            pendingApprovalCount={pendingMembersQuery.data?.length ?? 0}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}

export default MentoringMembersPage
