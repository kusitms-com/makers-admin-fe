import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('variant가 disable이면 별도 disabled prop 없이도 비활성화된다', () => {
    render(
      <Button variant="disable" size="m">
        저장하기
      </Button>,
    )

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it.each(['primary', 'strong', 'error', 'outlined'] as const)(
    'variant가 %s이면 기본적으로 활성화된다',
    (variant) => {
      render(
        <Button variant={variant} size="m">
          저장하기
        </Button>,
      )

      expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(
        false,
      )
    },
  )

  it('disabled prop을 명시하면 variant와 무관하게 그 값을 따른다', () => {
    render(
      <Button variant="primary" size="m" disabled>
        저장하기
      </Button>,
    )

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it('클릭 시 onClick이 호출된다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button variant="primary" size="m" onClick={onClick}>
        저장하기
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: '저장하기' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('leftIcon과 rightIcon을 함께 렌더링한다', () => {
    render(
      <Button
        variant="primary"
        size="m"
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      >
        저장하기
      </Button>,
    )

    expect(screen.getByTestId('left-icon')).toBeTruthy()
    expect(screen.getByTestId('right-icon')).toBeTruthy()
  })
})
