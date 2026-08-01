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

  it('active variant인데 썸네일이 아직 없으면 추가하기로 표시된다', () => {
    render(<IntroductionCard variant="active" title="내용" />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '추가하기' }).disabled).toBe(false)
  })

  it('타이틀을 입력하면 onTitleChange가 호출된다', async () => {
    const user = userEvent.setup()
    const onTitleChange = vi.fn()
    render(<IntroductionCard variant="default" onTitleChange={onTitleChange} />)

    await user.type(screen.getByPlaceholderText('타이틀'), 'A')

    expect(onTitleChange).toHaveBeenCalledWith('A')
  })

  it('설명을 입력하면 onDescriptionChange가 호출된다', async () => {
    const user = userEvent.setup()
    const onDescriptionChange = vi.fn()
    render(<IntroductionCard variant="default" onDescriptionChange={onDescriptionChange} />)

    await user.type(screen.getByPlaceholderText('설명을 입력해주세요'), 'A')

    expect(onDescriptionChange).toHaveBeenCalledWith('A')
  })

  it('삭제하기 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<IntroductionCard variant="active" onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('active variant에서 교체하기 버튼 클릭 시 파일을 선택하면 onThumbnailChange가 호출된다', async () => {
    const user = userEvent.setup()
    const onThumbnailChange = vi.fn()
    render(<IntroductionCard variant="active" onThumbnailChange={onThumbnailChange} />)

    const file = new File(['content'], 'thumb.png', { type: 'image/png' })
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
    if (!fileInput) throw new Error('file input not found')
    await user.upload(fileInput, file)

    expect(onThumbnailChange).toHaveBeenCalledWith(file)
  })
})
