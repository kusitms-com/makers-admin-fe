import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const items = [
  { value: '33', label: '33기' },
  { value: '32', label: '32기' },
  { value: '31', label: '31기' },
]

describe('SegmentedControl', () => {
  it('전달받은 항목을 모두 렌더링한다', () => {
    render(<SegmentedControl items={items} value="33" onValueChange={vi.fn()} />)

    expect(screen.getByRole('tab', { name: '33기' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: '32기' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: '31기' })).toBeTruthy()
  })

  it('value와 일치하는 탭만 aria-selected가 true다', () => {
    render(<SegmentedControl items={items} value="32" onValueChange={vi.fn()} />)

    expect(screen.getByRole('tab', { name: '32기' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tab', { name: '33기' }).getAttribute('aria-selected')).toBe('false')
    expect(screen.getByRole('tab', { name: '31기' }).getAttribute('aria-selected')).toBe('false')
  })

  it('탭 클릭 시 onValueChange가 해당 value로 호출된다', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SegmentedControl items={items} value="33" onValueChange={onValueChange} />)

    await user.click(screen.getByRole('tab', { name: '31기' }))

    expect(onValueChange).toHaveBeenCalledWith('31')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
})
