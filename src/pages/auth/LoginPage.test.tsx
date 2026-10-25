import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { LoginPage } from './LoginPage'

function renderLoginPage() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/introduction" element={<div>학회 소개 화면</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

function mockLogin(authority: 'MEMBER' | 'MANAGER' | 'OWNER', status = 200) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(
      JSON.stringify({
        code: status,
        message: '요청 결과',
        data: {
          accessToken: 'access',
          refreshToken: 'refresh',
          authority,
        },
      }),
      { status },
    ),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test')
  sessionStorage.clear()
  useAuthStore.setState({ session: { status: 'guest' } })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  sessionStorage.clear()
})

describe('LoginPage', () => {
  it('아이디와 비밀번호를 입력할 수 있다', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('로그인 아이디'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'password')

    expect(screen.getByLabelText<HTMLInputElement>('로그인 아이디').value).toBe('admin')
    expect(screen.getByLabelText<HTMLInputElement>('비밀번호').value).toBe('password')
  })

  it('아이디와 비밀번호를 비워 두면 필수 입력 검증에 걸린다', () => {
    renderLoginPage()

    expect(screen.getByLabelText<HTMLInputElement>('로그인 아이디').validity.valueMissing).toBe(
      true,
    )
    expect(screen.getByLabelText<HTMLInputElement>('비밀번호').validity.valueMissing).toBe(true)
  })

  it('배경 관리자 화면은 접근성 트리에서 숨겨 로그인 폼만 조작할 수 있다', () => {
    renderLoginPage()

    expect(screen.queryByRole('link', { name: '활동 후기' })).toBeNull()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('MANAGER 로그인 성공 시 관리자 첫 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    mockLogin('MANAGER')
    renderLoginPage()

    await user.type(screen.getByLabelText('로그인 아이디'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'password')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByText('학회 소개 화면')).toBeTruthy()
    expect(sessionStorage.getItem('kusitms-admin-refresh-token')).toBe('refresh')
  })

  it('MEMBER 로그인은 관리자 화면으로 이동하지 않고 오류를 보여준다', async () => {
    const user = userEvent.setup()
    mockLogin('MEMBER')
    renderLoginPage()

    await user.type(screen.getByLabelText('로그인 아이디'), 'member')
    await user.type(screen.getByLabelText('비밀번호'), 'password')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect((await screen.findByRole('alert')).textContent).toBe('관리자 권한이 없는 계정입니다.')
    expect(sessionStorage.getItem('kusitms-admin-refresh-token')).toBeNull()
  })

  it('로그인 API의 401은 다시 시도할 수 있는 입력 오류로 표시한다', async () => {
    const user = userEvent.setup()
    mockLogin('MEMBER', 401)
    renderLoginPage()

    await user.type(screen.getByLabelText('로그인 아이디'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'wrong')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect((await screen.findByRole('alert')).textContent).toBe(
      '아이디 또는 비밀번호를 확인해 주세요.',
    )
    expect(screen.getByRole<HTMLButtonElement>('button', { name: '로그인' }).disabled).toBe(false)
  })

  it('공백만 입력한 아이디는 서버에 보내지 않고 검증 오류를 보여준다', async () => {
    const user = userEvent.setup()
    const fetchMock = mockLogin('MANAGER')
    renderLoginPage()

    await user.type(screen.getByLabelText('로그인 아이디'), '   ')
    await user.type(screen.getByLabelText('비밀번호'), 'password')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect((await screen.findByRole('alert')).textContent).toBe('아이디를 입력해주세요')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
