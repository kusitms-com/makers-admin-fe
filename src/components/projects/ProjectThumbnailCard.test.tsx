import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProjectThumbnailCard } from './ProjectThumbnailCard'

describe('ProjectThumbnailCard', () => {
  it('서비스 이름을 렌더링한다', () => {
    render(<ProjectThumbnailCard imageUrl="/thumb.png" serviceName="큐시즘 웹" />)

    expect(screen.getByText('큐시즘 웹')).toBeTruthy()
  })

  it('삭제하기 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <ProjectThumbnailCard imageUrl="/thumb.png" serviceName="큐시즘 웹" onDelete={onDelete} />,
    )

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('삭제 버튼이 포커스될 때도 오버레이가 노출되도록 group-focus-within 클래스를 갖는다', () => {
    render(<ProjectThumbnailCard imageUrl="/thumb.png" serviceName="큐시즘 웹" />)

    const overlay = screen.getByRole('button', { name: '삭제하기' }).closest('.opacity-0')

    expect(overlay).not.toBeNull()
    expect(overlay?.className).toContain('group-focus-within:opacity-100')
  })
})
