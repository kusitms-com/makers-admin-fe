import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReviewTableRow } from './ReviewTableRow'

describe('ReviewTableRow', () => {
  it('학회원 후기 행에서는 첨부파일과 전화번호를 표시한다', () => {
    render(
      <ReviewTableRow
        type="memberReview"
        name="이현진"
        generation={33}
        part="DE"
        title="큐시즘 34기 서류 합격 후기"
        fileName="IMG_2346.PNG"
        phone="010-1234-5678"
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('IMG_2346.PNG')).toBeTruthy()
    expect(screen.getByText('010-1234-5678')).toBeTruthy()
  })

  it('블로그 후기 행에서는 카테고리를 표시하고 첨부파일/전화번호는 표시하지 않는다', () => {
    render(
      <ReviewTableRow
        type="blogReview"
        name="이현진"
        generation={33}
        part="DE"
        title="큐시즘 34기 서류 합격 후기"
        category="서류 후기"
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('서류 후기')).toBeTruthy()
    expect(screen.queryByText('010-1234-5678')).toBeNull()
  })

  it('이름, 기수, 파트, 제목을 렌더링한다', () => {
    render(
      <ReviewTableRow
        type="memberReview"
        name="이현진"
        generation={33}
        part="DE"
        title="큐시즘 34기 서류 합격 후기"
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('이현진')).toBeTruthy()
    expect(screen.getByText('33기')).toBeTruthy()
    expect(screen.getByText('디자인')).toBeTruthy()
    expect(screen.getByText('큐시즘 34기 서류 합격 후기')).toBeTruthy()
  })

  it('삭제 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <ReviewTableRow
        type="memberReview"
        name="이현진"
        generation={33}
        part="DE"
        title="큐시즘 34기 서류 합격 후기"
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
