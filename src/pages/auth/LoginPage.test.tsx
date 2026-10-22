import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('아이디와 비밀번호를 입력할 수 있다', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('로그인'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'password')

    expect(screen.getByLabelText<HTMLInputElement>('로그인').value).toBe('admin')
    expect(screen.getByLabelText<HTMLInputElement>('비밀번호').value).toBe('password')
  })

  it('배경 관리자 화면은 접근성 트리에서 숨겨 로그인 폼만 조작할 수 있다', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: '활동 후기' })).toBeNull()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})
