import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('자식에 id가 없으면 생성한 id로 label과 연결한다', () => {
    render(
      <FormField label="이름">
        <input placeholder="이름을 입력해주세요" />
      </FormField>,
    )

    expect(screen.getByLabelText('이름')).toBeTruthy()
  })

  it('자식에 이미 id가 있으면 그 id를 유지하고 label도 같은 id로 연결한다', () => {
    render(
      <FormField label="이름">
        <input id="custom-name-id" placeholder="이름을 입력해주세요" />
      </FormField>,
    )

    const field = screen.getByLabelText('이름')
    expect(field.id).toBe('custom-name-id')
  })
})
