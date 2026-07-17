import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ErrorFallback } from './ErrorFallback'

describe('ErrorFallback', () => {
  it('title을 렌더링한다', () => {
    render(<ErrorFallback title="문제가 발생했습니다" />)

    expect(screen.getByRole('heading', { name: '문제가 발생했습니다' })).toBeTruthy()
  })

  it('description이 있으면 렌더링한다', () => {
    render(<ErrorFallback title="문제가 발생했습니다" description="잠시 후 다시 시도해주세요." />)

    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeTruthy()
  })

  it('description이 없으면 렌더링하지 않는다', () => {
    render(<ErrorFallback title="문제가 발생했습니다" />)

    expect(screen.queryByText('잠시 후 다시 시도해주세요.')).toBeNull()
  })
})
