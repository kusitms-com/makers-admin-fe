import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Inputfield } from './Inputfield'

// 입력 중에 오류가 생겼다 사라졌다 하는 제어 입력칸
function LinkInput() {
  const [value, setValue] = useState('')
  return (
    <Inputfield
      aria-label="링크"
      value={value}
      error={value && !value.startsWith('https://') ? '형식 오류' : undefined}
      onChange={(event) => {
        setValue(event.target.value)
      }}
    />
  )
}

describe('Inputfield', () => {
  it('0을 입력값으로 인식한다', () => {
    render(<Inputfield value={0} readOnly aria-label="숫자 입력" />)

    expect(screen.getByLabelText('숫자 입력').parentElement?.className).toContain('bg-fill-normal')
  })

  it('전달받은 ref가 실제 입력 요소를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Inputfield ref={ref} aria-label="아이디 입력" />)

    expect(ref.current).toBe(screen.getByRole('textbox', { name: '아이디 입력' }))
  })

  it('입력 중에 오류가 생겨도 포커스를 잃지 않고 이어서 입력된다', async () => {
    const user = userEvent.setup()
    render(<LinkInput />)

    await user.click(screen.getByLabelText('링크'))
    await user.keyboard('https://a.com')

    expect(screen.getByLabelText<HTMLInputElement>('링크').value).toBe('https://a.com')
  })
})
