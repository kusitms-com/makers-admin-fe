import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
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

vi.mock('@api/members', () => ({
  getMembers: vi.fn().mockImplementation(() => Promise.resolve(MEMBER_ITEMS)),
}))

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MentoringMembersPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MentoringMembersPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'test-token', authority: 'MANAGER' },
    })
  })

  it('회원 수와 첫 페이지 목록을 표시한다', async () => {
    renderPage()

    expect(screen.getByRole('heading', { name: '회원 관리' })).toBeTruthy()
    expect(await screen.findByText('이현진')).toBeTruthy()
    expect(screen.getByLabelText('현재 위치')).toBeTruthy()
    expect(screen.getByRole('button', { name: '승인 요청 3' })).toBeTruthy()
    expect(screen.getByText('총 8명')).toBeTruthy()
    expect(screen.getByText('서지민')).toBeTruthy()
  })

  it('삭제 확인 후 회원을 삭제한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('서지민')
    await user.click(screen.getByRole('button', { name: '서지민 삭제' }))
    expect(screen.getByText('회원 삭제')).toBeTruthy()
    expect(
      screen.getByText('서지민 회원을 삭제하시겠습니까? 삭제된 회원 정보는 복구할 수 없습니다.'),
    ).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '취소' }))
    expect(screen.getByText('서지민')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '서지민 삭제' }))
    await user.click(screen.getByRole('button', { name: '삭제하기' }))
    expect(screen.queryByText('서지민')).toBeNull()
    expect(screen.getByText('총 7명')).toBeTruthy()
  })

  it('승인 요청 버튼을 누르면 승인 프레젠터를 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('이현진')
    await user.click(screen.getByRole('button', { name: '승인 요청 3' }))

    expect(screen.getByRole('link', { name: '회원 관리' }).getAttribute('href')).toBe('/members')
    expect(screen.getByRole('button', { name: '저장하기' })).toBeTruthy()
    expect(screen.getByText('총 4명')).toBeTruthy()
    expect(screen.getByText('수료증_김서연.pdf')).toBeTruthy()
  })
})
