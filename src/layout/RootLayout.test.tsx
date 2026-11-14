import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as AuthApi from '@api/auth/api'
import { getCurrentCardinal, updateCurrentCardinal } from '@api/auth/api'
import { useAuthStore } from '@hooks/auth/useAuth'
import { ConfirmProvider } from '@/providers/ConfirmProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { RootLayout } from './RootLayout'

vi.mock('@api/auth/api', async (importOriginal) => {
  const actual = await importOriginal<typeof AuthApi>()
  return {
    ...actual,
    getCurrentCardinal: vi.fn().mockResolvedValue(34),
    updateCurrentCardinal: vi.fn().mockResolvedValue({
      previousCardinal: 34,
      currentCardinal: 35,
      changedToOb: 23,
      changedToYb: 0,
    }),
  }
})

function renderRootLayout(initialEntries: string[]) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <ToastProvider>
          <ConfirmProvider>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/meetup" element={<div>밋업 페이지 콘텐츠</div>} />
                <Route path="/review" element={<div>후기 페이지 콘텐츠</div>} />
              </Route>
            </Routes>
          </ConfirmProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function chooseCardinal(user: ReturnType<typeof userEvent.setup>, label: string) {
  const select = await screen.findByRole('combobox', { name: '현재 기수' })
  await waitFor(() => {
    expect(select.textContent).toContain('34기')
  })
  await user.click(select)
  await user.click(await screen.findByRole('option', { name: label }))
}

function loginAs(authority: 'MANAGER' | 'OWNER') {
  useAuthStore.setState({ session: { status: 'authenticated', accessToken: 'token', authority } })
}

const originalLogout = useAuthStore.getState().logout

beforeEach(() => {
  vi.mocked(updateCurrentCardinal).mockClear()
  vi.mocked(getCurrentCardinal).mockResolvedValue(34)
})

afterEach(() => {
  useAuthStore.setState({ logout: originalLogout, session: { status: 'loading' } })
})

describe('RootLayout', () => {
  it('사이드바와 현재 라우트의 페이지 콘텐츠를 함께 렌더링한다', () => {
    renderRootLayout(['/meetup'])

    expect(screen.getByRole('link', { name: '밋업 프로젝트' })).toBeTruthy()
    expect(screen.getByText('밋업 페이지 콘텐츠')).toBeTruthy()
  })

  it('현재 경로에 맞는 사이드바 메뉴에만 aria-current가 붙는다', () => {
    renderRootLayout(['/review'])

    expect(screen.getByRole('link', { name: '활동 후기' }).getAttribute('aria-current')).toBe(
      'page',
    )
    expect(
      screen.getByRole('link', { name: '밋업 프로젝트' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  it('사이드바의 로그아웃 버튼을 누르면 logout을 호출하고 성공하면 토스트를 띄우지 않는다', async () => {
    const user = userEvent.setup()
    const logout = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
    useAuthStore.setState({ logout })
    renderRootLayout(['/meetup'])

    await user.click(screen.getByRole('button', { name: '로그아웃' }))

    expect(logout).toHaveBeenCalledOnce()
    expect(screen.queryByText('서버 로그아웃을 완료하지 못했습니다')).toBeNull()
  })

  it('로그아웃이 Error로 거부되면 실패 토스트를 보여준다', async () => {
    const user = userEvent.setup()
    useAuthStore.setState({
      logout: vi.fn<() => Promise<void>>().mockRejectedValue(new Error('서버 오류')),
    })
    renderRootLayout(['/meetup'])

    await user.click(screen.getByRole('button', { name: '로그아웃' }))

    expect(await screen.findByText('서버 로그아웃을 완료하지 못했습니다')).toBeTruthy()
  })

  it('MANAGER에게는 현재 기수만 보이고 바꿀 수 없다', async () => {
    const user = userEvent.setup()
    loginAs('MANAGER')
    renderRootLayout(['/meetup'])

    const select = await screen.findByRole('combobox', { name: '현재 기수' })
    await waitFor(() => {
      expect(select.textContent).toContain('34기')
    })
    await user.click(select)
    expect(screen.queryByRole('option', { name: '35기' })).toBeNull()
  })

  it('OWNER가 확인하면 다음 기수로 바꾸고 결과를 토스트로 알린다', async () => {
    const user = userEvent.setup()
    loginAs('OWNER')
    renderRootLayout(['/meetup'])

    await chooseCardinal(user, '35기')
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('전체 회원의 역할(YB/OB)이 다시 계산됩니다.')).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: '변경하기' }))

    expect(await screen.findByText('35기로 변경했습니다. YB→OB 23명')).toBeTruthy()
    expect(updateCurrentCardinal).toHaveBeenCalledWith(35, expect.anything())
  })

  it('OWNER가 확인 모달에서 취소하면 기수를 바꾸지 않는다', async () => {
    const user = userEvent.setup()
    loginAs('OWNER')
    renderRootLayout(['/meetup'])

    await chooseCardinal(user, '35기')
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: '취소' }),
    )

    expect(updateCurrentCardinal).not.toHaveBeenCalled()
  })

  it('확인하는 사이 다른 관리자가 기수를 바꿨으면 요청하지 않는다', async () => {
    const user = userEvent.setup()
    loginAs('OWNER')
    renderRootLayout(['/meetup'])

    await chooseCardinal(user, '35기')
    const dialog = await screen.findByRole('dialog')
    // 모달을 띄워 둔 사이 다른 OWNER가 35기로 바꾼 상황
    vi.mocked(getCurrentCardinal).mockResolvedValue(35)
    await user.click(within(dialog).getByRole('button', { name: '변경하기' }))

    expect(
      await screen.findByText(
        '다른 관리자가 현재 기수를 변경했습니다. 바뀐 기수를 확인한 뒤 다시 시도해주세요',
      ),
    ).toBeTruthy()
    expect(updateCurrentCardinal).not.toHaveBeenCalled()
  })
})
