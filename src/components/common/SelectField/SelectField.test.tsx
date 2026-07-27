import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormField } from '@components/common/FormField'
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

  it('compact 변형은 상태 선택용 팝업 스타일을 사용한다', async () => {
    const user = userEvent.setup()
    render(<SelectField value="PLAN" options={OPTIONS} onValueChange={vi.fn()} variant="compact" />)

    await user.click(screen.getByRole('combobox'))

    const listbox = await screen.findByRole('listbox')

    expect(listbox.className).toContain('shadow-[0_1px_5px')
    expect(listbox.className).toContain('text-label-light')
    expect(listbox.parentElement?.getAttribute('data-side')).toBe('bottom')
    expect(screen.getByRole('option', { name: '기획' }).className).toContain('rounded-lg')
  })

  it('FormField와 함께 쓰면 label이 정적 필드와 연결된다', () => {
    render(
      <FormField label="기수">
        <SelectField value="33기" options={[]} />
      </FormField>,
    )

    expect(screen.getByLabelText('기수').textContent).toContain('33기')
  })
})
