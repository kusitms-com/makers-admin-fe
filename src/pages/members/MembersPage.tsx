import { useState } from 'react'
import { useLocation } from 'react-router'
import dayjs from 'dayjs'
import type { AdminMemberResponse } from '@api/members'
import { Button, Modal, PageHeader } from '@/components/common'
import type { PartBadgeType } from '@/components/common/PartBadge'
import { type MentoringMemberRow, type MentoringMemberStatus } from '@/components/members'
import { useMembersQuery } from '@hooks/members/useMembers'
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

const INITIAL_APPROVALS: MentoringMemberRow[] = [
  {
    id: 'approval-1',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    phone: '010-1234-5678',
    email: 'abc12345@gmail.com',
    registeredAt: '26.03.12 18:33',
    isMentoringMember: true,
    status: 'PENDING',
  },
  {
    id: 'approval-2',
    name: '김서연',
    generation: 33,
    part: 'FE',
    phone: '010-2048-1357',
    email: 'seoyeon.kim@example.com',
    registeredAt: '26.03.12 17:09',
    isMentoringMember: true,
    status: 'PENDING',
    remark: '수료증_김서연.pdf',
  },
  {
    id: 'approval-3',
    name: '박민준',
    generation: 32,
    part: 'DE',
    phone: '010-9876-5432',
    email: 'minjun.park@example.com',
    registeredAt: '26.03.11 14:42',
    isMentoringMember: false,
    status: 'PENDING',
    remark: '수료증_박민준.pdf',
  },
  {
    id: 'approval-4',
    name: '최유진',
    generation: 33,
    part: 'BE',
    phone: '010-2468-1357',
    email: 'yujin.choi@example.com',
    registeredAt: '26.03.10 11:21',
    isMentoringMember: true,
    status: 'PENDING',
    remark: '수료증_최유진.pdf',
  },
]

export const MentoringMembersPage = () => {
  const { pathname } = useLocation()
  const isApprovalPage = pathname === '/members/approval'
  const membersQuery = useMembersQuery()
  // 실제 변경/삭제 API가 아직 없어서, 지금 목록 탭도 승인 대기 탭과 같은 로컬 전용(새로고침하면
  // 사라지는) 상태변경·삭제 버튼을 둔다. 조회 결과(membersQuery.data) 위에 로컬 override만 얹는다.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, MentoringMemberStatus>>({})
  const [deletedMemberIds, setDeletedMemberIds] = useState<string[]>([])
  const members = (membersQuery.data ?? [])
    .map(toMemberRow)
    .filter((member) => !deletedMemberIds.includes(member.id))
    .map((member) => {
      const hasOverride = Object.prototype.hasOwnProperty.call(statusOverrides, member.id)
      return hasOverride ? { ...member, status: statusOverrides[member.id] } : member
    })
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS)
  const [membersPage, setMembersPage] = useState(1)
  const [approvalPage, setApprovalPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<MentoringMemberRow | null>(null)
  const currentMembers = isApprovalPage ? approvals : members
  const page = isApprovalPage ? approvalPage : membersPage
  const setPage = isApprovalPage ? setApprovalPage : setMembersPage
  const totalPages = Math.max(1, Math.ceil(currentMembers.length / PAGE_SIZE))
  const pagedMembers = currentMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleStatusChange(id: string, status: MentoringMemberStatus) {
    if (isApprovalPage) {
      setApprovals((current) =>
        current.map((member) => (member.id === id ? { ...member, status } : member)),
      )
      return
    }
    setStatusOverrides((current) => ({ ...current, [id]: status }))
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

    if (!isApprovalPage) {
      const { id } = deleteTarget
      setDeletedMemberIds((current) => [...current, id])
      setMembersPage((currentPage) => {
        const nextLength = members.filter((member) => member.id !== id).length
        return Math.min(currentPage, Math.max(1, Math.ceil(nextLength / PAGE_SIZE)))
      })
      setDeleteTarget(null)
      return
    }

    const { id } = deleteTarget
    setApprovals((current) => {
      const nextApprovals = current.filter((member) => member.id !== id)
      setApprovalPage((currentPage) =>
        Math.min(currentPage, Math.max(1, Math.ceil(nextApprovals.length / PAGE_SIZE))),
      )
      return nextApprovals
    })
    setDeleteTarget(null)
  }

  if (!isApprovalPage && membersQuery.isLoading) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col">
        <PageHeader title="회원 관리" />
        <div className="text-label-14m text-label-alternative flex min-w-0 flex-1 items-center justify-center">
          불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (!isApprovalPage && membersQuery.isError) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col">
        <PageHeader title="회원 관리" />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3">
          <p className="text-label-14m text-label-alternative">회원 목록을 불러오지 못했습니다.</p>
          <Button
            variant="primary"
            size="s"
            onClick={() => {
              void membersQuery.refetch()
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
            onPageChange={setPage}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRequest}
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
