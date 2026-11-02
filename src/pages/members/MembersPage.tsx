import { useState } from 'react'
import { useLocation } from 'react-router'
import dayjs from 'dayjs'
import type { AdminMemberResponse, PendingMemberResponse } from '@api/members'
import { Button, Modal, PageHeader } from '@/components/common'
import type { PartBadgeType } from '@/components/common/PartBadge'
import { type MentoringMemberRow, type MentoringMemberStatus } from '@/components/members'
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
  const isApprovalPage = pathname === '/members/approval'
  const membersQuery = useMembersQuery()
  const pendingMembersQuery = usePendingMembersQuery()
  const approveMemberMutation = useApproveMemberMutation()
  const rejectMemberMutation = useRejectMemberMutation()
  const members = (membersQuery.data ?? []).map(toMemberRow)
  // 승인 대기 목록은 "저장하기" 연동 전까지 상태 변경/삭제를 화면에서만 반영한다.
  const [approvalEdits, setApprovalEdits] = useState<Record<string, Partial<MentoringMemberRow>>>(
    {},
  )
  const [deletedApprovalIds, setDeletedApprovalIds] = useState<ReadonlySet<string>>(new Set())
  const approvals = (pendingMembersQuery.data ?? [])
    .map(toPendingMemberRow)
    .filter((member) => !deletedApprovalIds.has(member.id))
    .map((member) => ({ ...member, ...approvalEdits[member.id] }))
  const [membersPage, setMembersPage] = useState(1)
  const [approvalPage, setApprovalPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<MentoringMemberRow | null>(null)
  const currentMembers = isApprovalPage ? approvals : members
  const activeQuery = isApprovalPage ? pendingMembersQuery : membersQuery
  const page = isApprovalPage ? approvalPage : membersPage
  const setPage = isApprovalPage ? setApprovalPage : setMembersPage
  const totalPages = Math.max(1, Math.ceil(currentMembers.length / PAGE_SIZE))
  const pagedMembers = currentMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleStatusChange(id: string, status: MentoringMemberStatus) {
    if (isApprovalPage) {
      setApprovalEdits((current) => ({ ...current, [id]: { ...current[id], status } }))
      return
    }
    if (status === 'APPROVED') {
      approveMemberMutation.mutate(Number(id))
      return
    }
    if (status === 'REJECTED') {
      const target = members.find((member) => member.id === id)
      if (target && window.confirm(`${target.name} 회원의 가입을 반려하시겠습니까?`)) {
        rejectMemberMutation.mutate(Number(id))
      }
    }
  }

  function handleDeleteRequest(id: string) {
    const target = currentMembers.find((member) => member.id === id)

    if (target) {
      setDeleteTarget(target)
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    const { id } = deleteTarget
    setDeletedApprovalIds((current) => new Set(current).add(id))
    setApprovalPage((currentPage) =>
      Math.min(currentPage, Math.max(1, Math.ceil((approvals.length - 1) / PAGE_SIZE))),
    )
    setDeleteTarget(null)
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
            onPageChange={setPage}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRequest}
          />
        ) : (
          <MemberListPresenter
            members={pagedMembers}
            page={page}
            totalPages={totalPages}
            totalLabel={`총 ${String(members.length)}명`}
            pendingApprovalCount={pendingMembersQuery.data?.length ?? 0}
            onPageChange={setPage}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <Modal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
        title="회원 삭제"
        footer={
          <>
            <Button
              variant="outlined"
              size="m"
              onClick={() => {
                setDeleteTarget(null)
              }}
            >
              취소
            </Button>
            <Button variant="error" size="m" onClick={handleConfirmDelete}>
              삭제하기
            </Button>
          </>
        }
      >
        <p className="text-label-14m text-label-normal">
          {deleteTarget?.name} 회원을 삭제하시겠습니까? 삭제된 회원 정보는 복구할 수 없습니다.
        </p>
      </Modal>
    </div>
  )
}

export default MentoringMembersPage
