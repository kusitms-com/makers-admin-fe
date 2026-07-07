import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TableFooter } from './TableFooter'

describe('TableFooter', () => {
  it('총 개수 라벨을 렌더링한다', () => {
    render(
      <TableFooter page={1} totalPages={3} onPageChange={vi.fn()} totalLabel="총 6개의 후기" />,
    )

    expect(screen.getByText('총 6개의 후기')).toBeTruthy()
  })

  it('전체 페이지 수만큼 페이지 버튼을 렌더링한다', () => {
    render(<TableFooter page={1} totalPages={3} onPageChange={vi.fn()} totalLabel="총 6개" />)

    expect(screen.getByRole('button', { name: '1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '3' })).toBeTruthy()
  })

  it('현재 페이지 버튼에 aria-current가 설정된다', () => {
    render(<TableFooter page={2} totalPages={3} onPageChange={vi.fn()} totalLabel="총 6개" />)

    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page')
  })

  it('페이지 번호 클릭 시 onPageChange가 해당 번호로 호출된다', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<TableFooter page={1} totalPages={3} onPageChange={onPageChange} totalLabel="총 6개" />)

    await user.click(screen.getByRole('button', { name: '2' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('첫 페이지에서는 이전 페이지 버튼이 비활성화된다', () => {
    render(<TableFooter page={1} totalPages={3} onPageChange={vi.fn()} totalLabel="총 6개" />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '이전 페이지' }).disabled).toBe(
      true,
    )
  })
})
