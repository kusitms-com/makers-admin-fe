import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  it('화면 낭독기에 로딩 중임을 알린다', () => {
    render(<LoadingState />)

    expect(screen.getByRole('status').textContent).toBe('불러오는 중입니다')
  })

  it('문구를 바꿀 수 있다', () => {
    render(<LoadingState label="상세 정보를 불러오는 중입니다" />)

    expect(screen.getByRole('status').textContent).toBe('상세 정보를 불러오는 중입니다')
  })
})
