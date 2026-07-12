import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toast, type ToastType } from './Toast'

describe('Toast', () => {
  it('message를 렌더링한다', () => {
    render(<Toast type="complete" message="메시지를 입력해주세요" />)

    const messageEl = screen.getByText('메시지를 입력해주세요')
    expect(messageEl).toBeTruthy()
    expect(messageEl.className).toContain('min-w-0')
    expect(messageEl.className).toContain('flex-1')
    expect(messageEl.className).toContain('truncate')
  })

  it.each<[ToastType, 'status' | 'alert']>([
    ['complete', 'status'],
    ['warning', 'status'],
    ['info', 'status'],
    ['error', 'alert'],
  ])('type=%s일 때 role=%s를 갖는다', (type, role) => {
    render(<Toast type={type} message="메시지" />)

    expect(screen.getByRole(role)).toBeTruthy()
  })

  it.each<[ToastType, string]>([
    ['complete', '#00BF40'],
    ['warning', '#FF9200'],
    ['info', '#3E5EFA'],
    ['error', '#E52222'],
  ])('type=%s일 때 해당 타입의 아이콘을 렌더링한다', (type, fill) => {
    const { container } = render(<Toast type={type} message="메시지" />)

    expect(container.querySelector(`path[fill="${fill}"]`)).toBeTruthy()
  })
})
