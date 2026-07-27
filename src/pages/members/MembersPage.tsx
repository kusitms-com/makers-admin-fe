import { useState } from 'react'
import { useLocation } from 'react-router'
import { PageHeader } from '@/components/common'
import { type MentoringMemberRow, type MentoringMemberStatus } from '@/components/members'
import { MemberApprovalPresenter } from './MemberApprovalPresenter'
import { MemberListPresenter } from './MemberListPresenter'

const PAGE_SIZE = 8

const INITIAL_MEMBERS: MentoringMemberRow[] = [
  {
    id: 'member-1',
    name: '이현진',
    generation: 33,
    part: 'BE',
    phone: '010-1234-5678',
    email: 'chris.miller@example.com',
    registeredAt: '26.03.12 18:33',
    isMentoringMember: true,
    status: 'PENDING',
  },
  {
    id: 'member-2',
    name: '김서연',
    generation: 33,
    part: 'FE',
    phone: '010-2048-1357',
    email: 'seoyeon.kim@example.com',
    registeredAt: '26.03.12 17:09',
    isMentoringMember: true,
    status: 'APPROVED',
    remark: '수료증_김서연.pdf',
  },
  {
    id: 'member-3',
    name: '박민준',
    generation: 32,
    part: 'PLAN',
    phone: '010-9876-5432',
    email: 'minjun.park@example.com',
    registeredAt: '26.03.11 14:42',
    isMentoringMember: false,
    status: 'PENDING',
  },
  {
    id: 'member-4',
    name: '최유진',
    generation: 33,
    part: 'DE',
    phone: '010-2468-1357',
    email: 'yujin.choi@example.com',
    registeredAt: '26.03.10 11:21',
    isMentoringMember: true,
    status: 'REJECTED',
    remark: '수료증_최유진.pdf',
  },
  {
    id: 'member-5',
    name: '정하늘',
    generation: 32,
    part: 'BE',
    phone: '010-5555-1278',
    email: 'haneul.jeong@example.com',
    registeredAt: '26.03.09 16:10',
    isMentoringMember: false,
    status: 'APPROVED',
  },
  {
    id: 'member-6',
    name: '윤지수',
    generation: 31,
    part: 'FE',
    phone: '010-7654-3210',
    email: 'jisu.yoon@example.com',
    registeredAt: '26.03.08 09:15',
    isMentoringMember: true,
    status: 'PENDING',
    remark: '수료증_윤지수.pdf',
  },
  {
    id: 'member-7',
    name: '한도윤',
    generation: 33,
    part: 'PLAN',
    phone: '010-1122-3344',
    email: 'doyoon.han@example.com',
    registeredAt: '26.03.07 19:28',
    isMentoringMember: true,
    status: 'APPROVED',
  },
  {
    id: 'member-8',
    name: '서지민',
    generation: 32,
    part: 'DE',
    phone: '010-6677-8899',
    email: 'jimin.seo@example.com',
    registeredAt: '26.03.06 13:54',
    isMentoringMember: false,
    status: 'PENDING',
  },
]

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
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS)
  const [membersPage, setMembersPage] = useState(1)
  const [approvalPage, setApprovalPage] = useState(1)
  const currentMembers = isApprovalPage ? approvals : members
  const setCurrentMembers = isApprovalPage ? setApprovals : setMembers
  const page = isApprovalPage ? approvalPage : membersPage
  const setPage = isApprovalPage ? setApprovalPage : setMembersPage
  const totalPages = Math.max(1, Math.ceil(currentMembers.length / PAGE_SIZE))
  const pagedMembers = currentMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleStatusChange(id: string, status: MentoringMemberStatus) {
    setCurrentMembers((currentMembers) =>
      currentMembers.map((member) => (member.id === id ? { ...member, status } : member)),
    )
  }

  function handleDelete(id: string) {
    setCurrentMembers((currentMembers) => {
      const nextMembers = currentMembers.filter((member) => member.id !== id)
      setPage((currentPage) =>
        Math.min(currentPage, Math.max(1, Math.ceil(nextMembers.length / PAGE_SIZE))),
      )
      return nextMembers
    })
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
            onDelete={handleDelete}
          />
        ) : (
          <MemberListPresenter
            members={pagedMembers}
            page={page}
            totalPages={totalPages}
            totalLabel={`총 ${String(members.length)}명`}
            onPageChange={setPage}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

export default MentoringMembersPage
