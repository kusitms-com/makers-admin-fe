import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CardinalField } from './CardinalField'

const OPTIONS = [
  { value: '34', label: '34기' },
  { value: '33', label: '33기' },
]

describe('CardinalField', () => {
  it('기수 값을 "N기" 형태로 보여준다', () => {
    render(<CardinalField cardinal={33} />)

    expect(screen.getByLabelText('기수').textContent).toContain('33기')
  })

  it('선택지를 넘기지 않으면 고를 수 없는 고정 칸이다', () => {
    render(<CardinalField cardinal={33} />)

    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('선택지와 변경 함수를 넘기면 다른 기수를 고를 수 있다', async () => {
    const user = userEvent.setup()
    const onCardinalChange = vi.fn()
    render(<CardinalField cardinal={34} options={OPTIONS} onCardinalChange={onCardinalChange} />)

    expect(screen.getByRole('combobox').textContent).toContain('34기')
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: '33기' }))

    expect(onCardinalChange).toHaveBeenCalledWith(33)
  })
})
