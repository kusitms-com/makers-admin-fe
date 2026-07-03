import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('메뉴 7개를 모두 렌더링한다', () => {
    render(<Sidebar activeKey="meetup" onNavigate={vi.fn()} />)

    expect(screen.getByRole('button', { name: '학회 소개' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '밋업 프로젝트' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '기업 프로젝트' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '후기' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '블로그 후기' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '회원 관리' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '멘토링 관리' })).toBeTruthy()
  })

  it('activeKey와 일치하는 메뉴에만 aria-current="page"가 붙는다', () => {
    render(<Sidebar activeKey="review" onNavigate={vi.fn()} />)

    expect(screen.getByRole('button', { name: '후기' }).getAttribute('aria-current')).toBe('page')
    expect(
      screen.getByRole('button', { name: '밋업 프로젝트' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  it('메뉴 클릭 시 onNavigate가 해당 key로 호출된다', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar activeKey="meetup" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: '기업 프로젝트' }))

    expect(onNavigate).toHaveBeenCalledWith('company')
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it('아이콘을 공유하는 메뉴끼리도 각자 다른 key로 구분된다', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar activeKey="meetup" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: '회원 관리' }))

    expect(onNavigate).toHaveBeenCalledWith('members')
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it('로그아웃 클릭 시 onLogout이 호출된다', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    render(<Sidebar activeKey="meetup" onNavigate={vi.fn()} onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: '로그아웃' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
