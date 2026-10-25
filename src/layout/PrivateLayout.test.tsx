import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { PrivateLayout } from './PrivateLayout'

beforeEach(() => {
  useAuthStore.setState({ session: { status: 'loading' } })
})

function renderPrivateRoute() {
  render(
    <MemoryRouter initialEntries={['/review']}>
      <Routes>
        <Route path="/login" element={<div>로그인 페이지</div>} />
        <Route element={<PrivateLayout />}>
          <Route path="/review" element={<div>관리자 후기 페이지</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PrivateLayout', () => {
  it('세션 확인 중에는 관리자 콘텐츠를 보여주지 않는다', () => {
    renderPrivateRoute()

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.queryByText('관리자 후기 페이지')).toBeNull()
  })

  it('비로그인 상태에서는 로그인 화면으로 이동한다', () => {
    useAuthStore.setState({ session: { status: 'guest' } })

    renderPrivateRoute()

    expect(screen.getByText('로그인 페이지')).toBeTruthy()
    expect(screen.queryByText('관리자 후기 페이지')).toBeNull()
  })

  it('관리자 세션에서는 보호된 화면을 보여준다', () => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'access', authority: 'OWNER' },
    })

    renderPrivateRoute()

    expect(screen.getByText('관리자 후기 페이지')).toBeTruthy()
  })
})
