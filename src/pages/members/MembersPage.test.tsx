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
    expect(screen.getByLabelText('현재 위치')).toBeTruthy()
    expect(screen.getByRole('button', { name: '승인 요청 3' })).toBeTruthy()
    expect(screen.getByText('총 8명')).toBeTruthy()
    expect(screen.getByText('이현진')).toBeTruthy()
    expect(screen.getByText('비고')).toBeTruthy()
    expect(screen.getByText('수료증_김서연.pdf')).toBeTruthy()
    expect(screen.getByText('서지민')).toBeTruthy()
  })

  it('삭제 확인 후 회원을 삭제한다', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MentoringMembersPage />
      </MemoryRouter>,
    )

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
    render(
      <MemoryRouter>
        <MentoringMembersPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: '승인 요청 3' }))

    expect(screen.getByRole('link', { name: '회원 관리' }).getAttribute('href')).toBe('/members')
    expect(screen.getByRole('button', { name: '저장하기' })).toBeTruthy()
    expect(screen.getByText('총 4명')).toBeTruthy()
    expect(screen.getByText('수료증_김서연.pdf')).toBeTruthy()
  })
})
