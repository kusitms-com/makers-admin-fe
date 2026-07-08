import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReviewTable } from './ReviewTable'

const BLOG_REVIEW_ROWS = [
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

const MEMBER_REVIEW_ROWS = [
  {
    id: '1',
    name: '이현진',
    generation: 33,
    part: 'PLAN' as const,
    phone: '010-1234-5678',
    fileName: 'IMG_2346.PNG',
    title: '큐시즘 34기 서류 합격 후기',
  },
]

describe('ReviewTable', () => {
  it('블로그 후기 컬럼 헤더를 렌더링한다', () => {
    render(
      <ReviewTable
        type="blogReview"
        rows={BLOG_REVIEW_ROWS}
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
        type="blogReview"
        rows={BLOG_REVIEW_ROWS}
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
        type="blogReview"
        rows={BLOG_REVIEW_ROWS}
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
        type="blogReview"
        rows={BLOG_REVIEW_ROWS}
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

  it('학회원 후기 컬럼 헤더와 첨부파일/전화번호를 렌더링한다', () => {
    render(
      <ReviewTable
        type="memberReview"
        rows={MEMBER_REVIEW_ROWS}
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
        totalLabel="총 1개의 후기"
      />,
    )

    expect(screen.getByText('첨부파일')).toBeTruthy()
    expect(screen.getByText('전화번호')).toBeTruthy()
    expect(screen.getByText('IMG_2346.PNG')).toBeTruthy()
    expect(screen.getByText('010-1234-5678')).toBeTruthy()
    expect(screen.queryByText('활동')).toBeNull()
  })

  it('rows가 빈 배열이면 안내 메시지를 렌더링한다', () => {
    render(
      <ReviewTable
        type="blogReview"
        rows={[]}
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
        totalLabel="총 0개의 후기"
      />,
    )

    expect(screen.getByText('표시할 후기가 없습니다.')).toBeTruthy()
  })
})
