import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { useToastStore } from '@hooks/common/useToast'
import { ConfirmProvider } from '@/providers/ConfirmProvider'
import { MentoringMembersPage } from './MembersPage'

const MEMBER_ITEMS = [
  {
    userId: 1,
    id: 'hyunjin',
    name: '이현진',
    phone: '010-1234-5678',
    email: 'chris.miller@example.com',
    cardinal: 33,
    part: 'BACKEND',
    status: 'PENDING',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-12T18:33:00',
  },
  {
    userId: 2,
    id: 'seoyeon',
    name: '김서연',
    phone: '010-2048-1357',
    email: 'seoyeon.kim@example.com',
    cardinal: 33,
    part: 'FRONTEND',
    status: 'APPROVED',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-12T17:09:00',
  },
  {
    userId: 3,
    id: 'minjun',
    name: '박민준',
    phone: '010-9876-5432',
    email: 'minjun.park@example.com',
    cardinal: 32,
    part: 'PLANNER',
    status: 'PENDING',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-11T14:42:00',
  },
  {
    userId: 4,
    id: 'yujin',
    name: '최유진',
    phone: '010-2468-1357',
    email: 'yujin.choi@example.com',
    cardinal: 33,
    part: 'DESIGNER',
    status: 'WITHDRAWN',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-10T11:21:00',
  },
  {
    userId: 5,
    id: 'haneul',
    name: '정하늘',
    phone: '010-5555-1278',
    email: 'haneul.jeong@example.com',
    cardinal: 32,
    part: 'BACKEND',
    status: 'APPROVED',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-09T16:10:00',
  },
  {
    userId: 6,
    id: 'jisu',
    name: '윤지수',
    phone: '010-7654-3210',
    email: 'jisu.yoon@example.com',
    cardinal: 31,
    part: 'FRONTEND',
    status: 'PENDING',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-08T09:15:00',
  },
  {
    userId: 7,
    id: 'doyoon',
    name: '한도윤',
    phone: '010-1122-3344',
    email: 'doyoon.han@example.com',
    cardinal: 33,
    part: 'PLANNER',
    status: 'APPROVED',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-07T19:28:00',
  },
  {
    userId: 8,
    id: 'jimin',
    name: '서지민',
    phone: '010-6677-8899',
    email: 'jimin.seo@example.com',
    cardinal: 32,
    part: 'DESIGNER',
    status: 'PENDING',
    role: 'YB',
    authority: 'MEMBER',
    createdAt: '2026-03-06T13:54:00',
  },
]

const PENDING_ITEMS = [
  {
    userId: 101,
    id: 'hyunjin-pending',
    name: '이현진',
    phone: '010-1234-5678',
    cardinal: 33,
    part: 'PLANNER',
    profileImageUrl: 'https://cdn.example.com/profiles/1.png',
    certificateImageUrl: 'https://cdn.example.com/certs/1.pdf',
  },
  {
    userId: 102,
    id: 'seoyeon-pending',
    name: '김서연',
    phone: '010-2048-1357',
    cardinal: 33,
    part: 'FRONTEND',
    profileImageUrl: 'https://cdn.example.com/profiles/2.png',
    certificateImageUrl: 'https://cdn.example.com/certs/수료증_김서연.pdf',
  },
  {
    userId: 103,
    id: 'minjun-pending',
    name: '박민준',
    phone: '010-9876-5432',
    cardinal: 32,
    part: 'DESIGNER',
    profileImageUrl: 'https://cdn.example.com/profiles/3.png',
    certificateImageUrl: 'https://cdn.example.com/certs/수료증_박민준.pdf',
  },
  {
    userId: 104,
    id: 'yujin-pending',
    name: '최유진',
    phone: '010-2468-1357',
    cardinal: 33,
    part: 'BACKEND',
    profileImageUrl: 'https://cdn.example.com/profiles/4.png',
    certificateImageUrl: 'https://cdn.example.com/certs/수료증_최유진.pdf',
  },
]

const memberItems = MEMBER_ITEMS.map((member) => ({ ...member }))
let pendingItems = PENDING_ITEMS.map((member) => ({ ...member }))

const approveMember = vi.fn((userId: number) => {
  pendingItems = pendingItems.filter((member) => member.userId !== userId)
  return Promise.resolve({})
})
const rejectMember = vi.fn((userId: number) => {
  pendingItems = pendingItems.filter((member) => member.userId !== userId)
  return Promise.resolve({})
})
// 회원 관리 화면은 status=APPROVED로 필터링해서 조회한다.
const getMembers = vi.fn((status?: string) =>
  Promise.resolve(status ? memberItems.filter((member) => member.status === status) : memberItems),
)
const getPendingMembers = vi.fn(() => Promise.resolve(pendingItems))

vi.mock('@api/members/api', () => ({
  getMembers: (status?: string) => getMembers(status),
  getPendingMembers: () => getPendingMembers(),
  approveMember: (userId: number) => approveMember(userId),
  rejectMember: (userId: number) => rejectMember(userId),
}))

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ConfirmProvider>
          <MentoringMembersPage />
        </ConfirmProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MentoringMembersPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'test-token', authority: 'MANAGER' },
    })
    pendingItems = PENDING_ITEMS.map((member) => ({ ...member }))
    useToastStore.setState({ toasts: [] })
    vi.clearAllMocks()
  })

  it('승인된 회원만 필터링해서 조회하고 표시한다', async () => {
    renderPage()

    expect(screen.getByRole('heading', { name: '회원 관리' })).toBeTruthy()
    expect(await screen.findByText('김서연')).toBeTruthy()
    expect(getMembers).toHaveBeenCalledWith('APPROVED')
    expect(screen.getByLabelText('현재 위치')).toBeTruthy()
    expect(screen.getByRole('button', { name: '승인 요청 4' })).toBeTruthy()
    expect(screen.getByText('총 3명')).toBeTruthy()
    expect(screen.getByText('정하늘')).toBeTruthy()
    expect(screen.getByText('한도윤')).toBeTruthy()
    expect(screen.queryByText('이현진')).toBeNull()
  })

  it('승인 대기 회원이 없으면 승인 요청 버튼이 비활성화된다', async () => {
    getPendingMembers.mockResolvedValueOnce([])
    renderPage()

    await screen.findByText('김서연')
    const button = screen.getByRole('button', { name: '승인 요청 0' })
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('회원 목록 화면에는 상태 컬럼이 없다', async () => {
    renderPage()

    await screen.findByText('김서연')
    expect(screen.queryByRole('columnheader', { name: '상태' })).toBeNull()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('승인 요청 버튼을 누르면 승인 프레젠터를 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('김서연')
    await user.click(screen.getByRole('button', { name: '승인 요청 4' }))

    expect(screen.getByRole('link', { name: '회원 관리' }).getAttribute('href')).toBe('/members')
    expect(screen.getByRole('columnheader', { name: '상태' })).toBeTruthy()
    expect(screen.getByText('총 4명')).toBeTruthy()
    expect(screen.getByText('수료증_김서연.pdf')).toBeTruthy()
    const saveButton = screen.getByRole('button', { name: '저장하기' })
    expect(saveButton.hasAttribute('disabled')).toBe(true)
  })

  it('승인/반려를 선택해도 저장 전에는 API가 호출되지 않고, 저장하기를 누르면 일괄 호출된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('김서연')
    await user.click(screen.getByRole('button', { name: '승인 요청 4' }))

    await user.click(screen.getByRole('combobox', { name: '이현진 회원 상태' }))
    await user.click(await screen.findByRole('option', { name: '완료' }))
    await user.click(screen.getByRole('combobox', { name: '김서연 회원 상태' }))
    await user.click(await screen.findByRole('option', { name: '거절' }))

    expect(approveMember).not.toHaveBeenCalled()
    expect(rejectMember).not.toHaveBeenCalled()
    const saveButton = screen.getByRole('button', { name: '저장하기' })
    expect(saveButton.hasAttribute('disabled')).toBe(false)

    await user.click(saveButton)

    const dialog = await screen.findByRole('dialog', { name: '저장하시겠습니까?' })
    expect(within(dialog).getByText('반려로 선택한 회원은 계정이 삭제됩니다.')).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: '저장하기' }))

    expect(approveMember).toHaveBeenCalledWith(101)
    expect(rejectMember).toHaveBeenCalledWith(102)
    expect(await screen.findByRole('button', { name: '승인 요청 2' })).toBeTruthy()
    expect(useToastStore.getState().toasts.map((toast) => toast.message)).toContain(
      '승인 처리가 완료됐습니다.',
    )
  })

  it('반려 확인을 취소하면 API를 호출하지 않고 승인 화면에 머문다', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('김서연')
    await user.click(screen.getByRole('button', { name: '승인 요청 4' }))

    await user.click(screen.getByRole('combobox', { name: '박민준 회원 상태' }))
    await user.click(await screen.findByRole('option', { name: '거절' }))
    await user.click(screen.getByRole('button', { name: '저장하기' }))

    const dialog = await screen.findByRole('dialog', { name: '저장하시겠습니까?' })
    await user.click(within(dialog).getByRole('button', { name: '취소' }))

    expect(rejectMember).not.toHaveBeenCalled()
    expect(screen.getByText('회원가입 승인')).toBeTruthy()
  })
})
