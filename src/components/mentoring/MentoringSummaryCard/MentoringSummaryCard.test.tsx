import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MentoringSummaryCard } from './MentoringSummaryCard'

describe('MentoringSummaryCard', () => {
  it('라벨과 카운트를 렌더링한다', () => {
    render(<MentoringSummaryCard label="승인 대기 요청" count={2} icon={<span>icon</span>} />)

    expect(screen.getByText('승인 대기 요청')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
  })

  it('onClick이 없으면 div로 렌더링하고 chevron을 숨긴다', () => {
    const { container } = render(
      <MentoringSummaryCard label="승인 대기 요청" count={2} icon={<span>icon</span>} />,
    )

    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('onClick이 있으면 button으로 렌더링하고 클릭 시 호출한다', () => {
    const handleClick = vi.fn()
    render(
      <MentoringSummaryCard
        label="승인 대기 요청"
        count={2}
        icon={<span>icon</span>}
        onClick={handleClick}
      />,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
