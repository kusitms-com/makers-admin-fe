import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { Sidebar } from './Sidebar'

function renderSidebar(onLogout?: () => void, initialEntries = ['/meetup']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Sidebar onLogout={onLogout} />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('메뉴 7개를 모두 렌더링한다', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: '학회 소개' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '밋업 프로젝트' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '기업 프로젝트' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '활동 후기' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '블로그 후기' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '회원 관리' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '멘토링 관리' })).toBeTruthy()
  })

  it('현재 URL과 일치하는 메뉴에만 aria-current="page"가 붙는다', () => {
    renderSidebar(undefined, ['/review'])

    expect(screen.getByRole('link', { name: '활동 후기' }).getAttribute('aria-current')).toBe(
      'page',
    )
    expect(
      screen.getByRole('link', { name: '밋업 프로젝트' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  it('메뉴마다 고유한 경로로 연결된다', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: '기업 프로젝트' }).getAttribute('href')).toBe(
      '/company',
    )
    expect(screen.getByRole('link', { name: '회원 관리' }).getAttribute('href')).toBe('/members')
    expect(screen.getByRole('link', { name: '멘토링 관리' }).getAttribute('href')).toBe(
      '/mentoring',
    )
  })

  it('로그아웃 클릭 시 onLogout이 호출된다', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    renderSidebar(onLogout)

    await user.click(screen.getByRole('button', { name: '로그아웃' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('현재 기수를 보여 주고, 변경 핸들러가 없으면 변경 버튼을 숨긴다', () => {
    render(
      <MemoryRouter>
        <Sidebar currentCardinal={34} />
      </MemoryRouter>,
    )

    expect(screen.getByText('현재 34기')).toBeTruthy()
    expect(screen.queryByRole('button', { name: '35기로 변경' })).toBeNull()
  })

  it('변경 핸들러가 있으면 다음 기수 변경 버튼을 누를 수 있다', async () => {
    const user = userEvent.setup()
    const onCardinalAdvance = vi.fn()
    render(
      <MemoryRouter>
        <Sidebar currentCardinal={34} onCardinalAdvance={onCardinalAdvance} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: '35기로 변경' }))

    expect(onCardinalAdvance).toHaveBeenCalledOnce()
  })
})
