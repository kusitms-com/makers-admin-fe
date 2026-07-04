import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { IntroductionCard } from './IntroductionCard'

describe('IntroductionCard', () => {
  it('default variant에서는 플레이스홀더를 보여주고 추가하기 버튼이 비활성화된다', () => {
    render(<IntroductionCard variant="default" />)

    expect(screen.getByPlaceholderText('타이틀')).toBeTruthy()
    expect(screen.getByPlaceholderText('설명을 입력해주세요')).toBeTruthy()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: '추가하기' }).disabled).toBe(true)
    expect(screen.getByRole<HTMLButtonElement>('button', { name: '삭제하기' }).disabled).toBe(false)
  })

  it('active variant에서는 입력값을 보여주고 교체하기 버튼이 활성화된다', () => {
    render(
      <IntroductionCard
        variant="active"
        title="내용"
        description="큐시즘 오리엔테이션 소개"
        thumbnailUrl="/thumb.png"
      />,
    )

    expect(screen.getByDisplayValue('내용')).toBeTruthy()
    expect(screen.getByDisplayValue('큐시즘 오리엔테이션 소개')).toBeTruthy()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: '교체하기' }).disabled).toBe(false)
  })

  it('삭제하기 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<IntroductionCard variant="active" onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('active variant에서 교체하기 버튼 클릭 시 onAddOrReplace가 호출된다', async () => {
    const user = userEvent.setup()
    const onAddOrReplace = vi.fn()
    render(<IntroductionCard variant="active" onAddOrReplace={onAddOrReplace} />)

    await user.click(screen.getByRole('button', { name: '교체하기' }))

    expect(onAddOrReplace).toHaveBeenCalledTimes(1)
  })
})
