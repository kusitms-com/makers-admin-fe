import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { RootLayout } from './RootLayout'

function renderRootLayout(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/meetup" element={<div>밋업 페이지 콘텐츠</div>} />
          <Route path="/review" element={<div>후기 페이지 콘텐츠</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('RootLayout', () => {
  it('사이드바와 현재 라우트의 페이지 콘텐츠를 함께 렌더링한다', () => {
    renderRootLayout(['/meetup'])

    expect(screen.getByRole('link', { name: '밋업 프로젝트' })).toBeTruthy()
    expect(screen.getByText('밋업 페이지 콘텐츠')).toBeTruthy()
  })

  it('현재 경로에 맞는 사이드바 메뉴에만 aria-current가 붙는다', () => {
    renderRootLayout(['/review'])

    expect(screen.getByRole('link', { name: '후기' }).getAttribute('aria-current')).toBe('page')
    expect(
      screen.getByRole('link', { name: '밋업 프로젝트' }).getAttribute('aria-current'),
    ).toBeNull()
  })
})
