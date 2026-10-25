import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { ToastProvider } from '@/providers/ToastProvider'
import { RootLayout } from './RootLayout'

function renderRootLayout(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ToastProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/meetup" element={<div>밋업 페이지 콘텐츠</div>} />
            <Route path="/review" element={<div>후기 페이지 콘텐츠</div>} />
          </Route>
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  )
}

const originalLogout = useAuthStore.getState().logout

afterEach(() => {
  useAuthStore.setState({ logout: originalLogout })
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
    expect(screen.queryByText('서버 로그아웃을 완료하지 못했습니다.')).toBeNull()
  })

  it('로그아웃이 Error로 거부되면 실패 토스트를 보여준다', async () => {
    const user = userEvent.setup()
    useAuthStore.setState({
      logout: vi.fn<() => Promise<void>>().mockRejectedValue(new Error('서버 오류')),
    })
    renderRootLayout(['/meetup'])

    await user.click(screen.getByRole('button', { name: '로그아웃' }))

    expect(await screen.findByText('서버 로그아웃을 완료하지 못했습니다.')).toBeTruthy()
  })
})
