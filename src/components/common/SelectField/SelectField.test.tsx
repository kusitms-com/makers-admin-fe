import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelectField } from './SelectField'

const OPTIONS = [
  { value: 'PLAN', label: '기획' },
  { value: 'DE', label: '디자인' },
]

describe('SelectField', () => {
  it('onValueChange가 없으면 선택지 없이 값만 보여준다', () => {
    render(<SelectField value="PLAN" options={OPTIONS} />)

    expect(screen.getByText('기획')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('onValueChange가 있으면 선택 가능한 드롭다운으로 렌더링한다', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SelectField value="PLAN" options={OPTIONS} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: '디자인' }))

    expect(onValueChange).toHaveBeenCalledWith('DE')
  })

  it('값이 없으면 placeholder를 보여준다', () => {
    render(
      <SelectField value="" options={OPTIONS} onValueChange={vi.fn()} placeholder="선택해주세요" />,
    )

    expect(screen.getByText('선택해주세요')).toBeTruthy()
  })
})
