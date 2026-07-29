import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AddCircleButton } from './AddCircleButton'

describe('AddCircleButton', () => {
  it('aria-label로 접근 가능한 이름을 노출한다', () => {
    render(<AddCircleButton aria-label="활동 추가" />)

    expect(screen.getByRole('button', { name: '활동 추가' })).toBeTruthy()
  })

  it('클릭 시 onClick이 호출된다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<AddCircleButton aria-label="활동 추가" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: '활동 추가' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
