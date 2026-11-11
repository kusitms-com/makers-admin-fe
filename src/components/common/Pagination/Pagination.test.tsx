import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

// 이전·다음 버튼을 뺀 번호와 말줄임을 화면 순서대로 읽는다.
function renderedItems(page: number, totalPages: number) {
  render(<Pagination page={page} totalPages={totalPages} onPageChange={vi.fn()} />)
  const items = Array.from(screen.getByRole('navigation').children).map(
    (element) => element.textContent,
  )
  return items.slice(1, -1).join(' ')
}

describe('Pagination 번호 창', () => {
  it('9페이지 이하면 모든 번호를 보여준다', () => {
    expect(renderedItems(1, 9)).toBe('1 2 3 4 5 6 7 8 9')
  })

  it('앞쪽에서는 뒤만 말줄임한다', () => {
    expect(renderedItems(1, 20)).toBe('1 2 3 4 5 6 7 … 20')
  })

  it('가운데에서는 현재 ±2만 보여주고 양쪽을 말줄임한다', () => {
    expect(renderedItems(10, 20)).toBe('1 … 8 9 10 11 12 … 20')
  })

  it('뒤쪽에서는 앞만 말줄임한다', () => {
    expect(renderedItems(20, 20)).toBe('1 … 14 15 16 17 18 19 20')
  })

  it('경계에서도 말줄임은 번호를 두 개 이상 가리고 칸 수는 9개로 유지한다', () => {
    expect(renderedItems(5, 10)).toBe('1 2 3 4 5 6 7 … 10')
  })

  it('경계 반대쪽도 같은 규칙을 따른다', () => {
    expect(renderedItems(6, 10)).toBe('1 … 4 5 6 7 8 9 10')
  })
})

describe('Pagination', () => {
  it('전체 페이지 수만큼 페이지 버튼을 렌더링한다', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '3' })).toBeTruthy()
  })

  it('현재 페이지 버튼에 aria-current가 설정된다', () => {
    render(<Pagination page={2} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull()
  })

  it('첫 페이지에서는 이전 페이지 버튼이 비활성화된다', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '이전 페이지' }).disabled).toBe(
      true,
    )
  })

  it('마지막 페이지에서는 다음 페이지 버튼이 비활성화된다', () => {
    render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '다음 페이지' }).disabled).toBe(
      true,
    )
  })

  it('페이지 번호 클릭 시 onPageChange가 해당 번호로 호출된다', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: '2' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('다음 페이지 버튼 클릭 시 onPageChange가 다음 번호로 호출된다', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: '다음 페이지' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
