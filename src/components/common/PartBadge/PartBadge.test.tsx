import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PartBadge } from './PartBadge'

describe('PartBadge', () => {
  it('긴 파트 이름도 줄바꿈 없이 표시한다', () => {
    render(<PartBadge part="FE" />)

    expect(screen.getByText('프론트엔드').className).toContain('whitespace-nowrap')
    expect(screen.getByText('프론트엔드').className).toContain('shrink-0')
  })
})
