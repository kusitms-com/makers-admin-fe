import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PartImageCard } from './PartImageCard'

describe('PartImageCard', () => {
  it('파트 라벨을 렌더링한다', () => {
    render(<PartImageCard partLabel="기획" />)

    expect(screen.getByText('기획')).toBeTruthy()
  })

  it('이미지가 없으면 업로드 안내를 보여준다', () => {
    render(<PartImageCard partLabel="디자인" />)

    expect(screen.getByText('업로드')).toBeTruthy()
  })

  it('이미지가 없으면 삭제하기 버튼은 비활성 상태다', () => {
    render(<PartImageCard partLabel="프론트엔드" />)

    const deleteButton = screen.getByRole<HTMLButtonElement>('button', { name: '삭제하기' })
    expect(deleteButton.disabled).toBe(true)
  })

  it('이미지가 있으면 삭제하기 버튼이 활성화되고 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<PartImageCard partLabel="프론트엔드" imageUrl="/thumb.png" onDelete={onDelete} />)

    const deleteButton = screen.getByRole<HTMLButtonElement>('button', { name: '삭제하기' })
    expect(deleteButton.disabled).toBe(false)

    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('교체하기 버튼 클릭 시 onReplace가 호출된다', async () => {
    const user = userEvent.setup()
    const onReplace = vi.fn()
    render(<PartImageCard partLabel="프론트엔드" onReplace={onReplace} />)

    await user.click(screen.getByRole('button', { name: '교체하기' }))

    expect(onReplace).toHaveBeenCalledTimes(1)
  })
})
