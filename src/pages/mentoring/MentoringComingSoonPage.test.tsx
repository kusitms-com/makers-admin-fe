import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { MentoringComingSoonPage } from './MentoringComingSoonPage'

function renderAt(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialEntries.length - 1}>
      <Routes>
        <Route path="/" element={<p>홈</p>} />
        <Route path="/members" element={<p>회원 관리 화면</p>} />
        <Route path="/mentoring" element={<MentoringComingSoonPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MentoringComingSoonPage', () => {
  it('준비중 안내 모달을 띄우고 Esc로 닫히지 않는다', async () => {
    const user = userEvent.setup()
    renderAt(['/mentoring'])

    expect(await screen.findByRole('dialog', { name: '아직 준비 중인 기능이에요' })).toBeTruthy()
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('돌아가기를 누르면 이전 페이지로 이동한다', async () => {
    const user = userEvent.setup()
    renderAt(['/members', '/mentoring'])

    await user.click(await screen.findByRole('button', { name: '돌아가기' }))

    expect(await screen.findByText('회원 관리 화면')).toBeTruthy()
  })

  it('이전 기록 없이 바로 들어왔으면 돌아가기로 기본 경로에 간다', async () => {
    const user = userEvent.setup()
    renderAt(['/mentoring'])

    await user.click(await screen.findByRole('button', { name: '돌아가기' }))

    expect(await screen.findByText('홈')).toBeTruthy()
  })
})
