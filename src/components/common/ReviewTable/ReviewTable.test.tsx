import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReviewTable } from './ReviewTable'

const ROWS = [
  {
    id: '1',
    name: '이현진',
    generation: 33,
    part: 'PLAN' as const,
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '2',
    name: '김도윤',
    generation: 34,
    part: 'DE' as const,
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
]

describe('ReviewTable', () => {
  it('컬럼 헤더를 렌더링한다', () => {
    render(
      <ReviewTable
        rows={ROWS}
        page={1}
        totalPages={2}
        onPageChange={vi.fn()}
        totalLabel="총 2개의 후기"
      />,
    )

    expect(screen.getByText('이름')).toBeTruthy()
    expect(screen.getByText('기수')).toBeTruthy()
    expect(screen.getByText('파트')).toBeTruthy()
    expect(screen.getByText('활동')).toBeTruthy()
    expect(screen.getByText('제목')).toBeTruthy()
  })

  it('행 데이터를 렌더링한다', () => {
    render(
      <ReviewTable
        rows={ROWS}
        page={1}
        totalPages={2}
        onPageChange={vi.fn()}
        totalLabel="총 2개의 후기"
      />,
    )

    expect(screen.getByText('이현진')).toBeTruthy()
    expect(screen.getByText('김도윤')).toBeTruthy()
    expect(screen.getAllByText('34기')).toHaveLength(1)
  })

  it('총 개수 라벨과 페이지네이션을 렌더링한다', () => {
    render(
      <ReviewTable
        rows={ROWS}
        page={2}
        totalPages={3}
        onPageChange={vi.fn()}
        totalLabel="총 2개의 후기"
      />,
    )

    expect(screen.getByText('총 2개의 후기')).toBeTruthy()
    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page')
  })

  it('행 삭제 버튼 클릭 시 onDeleteRow가 해당 id로 호출된다', async () => {
    const user = userEvent.setup()
    const onDeleteRow = vi.fn()
    render(
      <ReviewTable
        rows={ROWS}
        onDeleteRow={onDeleteRow}
        page={1}
        totalPages={2}
        onPageChange={vi.fn()}
        totalLabel="총 2개의 후기"
      />,
    )

    const deleteButtons = screen.getAllByRole('button', { name: '삭제' })
    await user.click(deleteButtons[1])

    expect(onDeleteRow).toHaveBeenCalledWith('2')
  })
})
