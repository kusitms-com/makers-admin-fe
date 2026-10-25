import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Inputfield } from './Inputfield'

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
})
