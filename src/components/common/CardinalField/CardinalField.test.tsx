import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardinalField } from './CardinalField'

describe('CardinalField', () => {
  it('기수 값을 "N기" 형태로 보여준다', () => {
    render(<CardinalField cardinal={33} />)

    expect(screen.getByLabelText('기수').textContent).toContain('33기')
  })
})
