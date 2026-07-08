import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

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
