import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { MentoringMembersPage } from './MembersPage'

describe('MentoringMembersPage', () => {
  it('회원 수와 첫 페이지 목록을 표시한다', () => {
    render(
      <MemoryRouter>
        <MentoringMembersPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '회원 관리' })).toBeTruthy()
    expect(screen.getByLabelText('현재 위치').className).toContain('text-body-18sb')
    expect(screen.getByText('회원가입 승인')).toBeTruthy()
    expect(screen.getByRole('button', { name: '승인 요청 3' })).toBeTruthy()
    expect(screen.getByText('총 8명')).toBeTruthy()
    expect(screen.getByText('이현진')).toBeTruthy()
    expect(screen.getByText('비고')).toBeTruthy()
    expect(screen.getByText('수료증_김서연.pdf')).toBeTruthy()
    expect(screen.queryByText('서지민')).toBeNull()
  })

  it('다음 페이지로 이동하고 회원을 삭제할 수 있다', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MentoringMembersPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: '다음 페이지' }))
    expect(screen.getByText('서지민')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '서지민 삭제' }))
    expect(screen.queryByText('서지민')).toBeNull()
    expect(screen.getByText('총 7명')).toBeTruthy()
  })

  it('승인 경로에서는 승인 프레젠터를 표시한다', () => {
    render(
      <MemoryRouter initialEntries={['/members/approval']}>
        <MentoringMembersPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: '회원 관리' }).getAttribute('href')).toBe('/members')
    expect(screen.getByRole('button', { name: '저장하기' })).toBeTruthy()
    expect(screen.getByText('총 4명')).toBeTruthy()
    expect(screen.getByText('수료증_김서연.pdf')).toBeTruthy()
  })
})
