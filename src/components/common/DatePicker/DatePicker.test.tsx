import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('선택된 날짜를 트리거 버튼에 표시한다', () => {
    render(<DatePicker value={new Date(2026, 5, 19)} onChange={() => {}} />)

    expect(screen.getByText('2026.06.19')).toBeTruthy()
  })

  it('트리거를 클릭하면 일 단위 캘린더가 열린다', () => {
    render(<DatePicker value={new Date(2026, 5, 19)} onChange={() => {}} />)

    fireEvent.click(screen.getByText('2026.06.19'))

    expect(screen.getByText('2026년 6월')).toBeTruthy()
    expect(screen.getByText('월')).toBeTruthy()
  })

  it('헤더를 클릭하면 월 뷰, 다시 클릭하면 연 뷰로 전환된다', () => {
    render(<DatePicker value={new Date(2026, 5, 19)} onChange={() => {}} />)

    fireEvent.click(screen.getByText('2026.06.19'))
    fireEvent.click(screen.getByText('2026년 6월'))

    expect(screen.getByText('2026년')).toBeTruthy()
    expect(screen.getByText('6월')).toBeTruthy()

    fireEvent.click(screen.getByText('2026년'))

    expect(screen.getByText('2021 - 2032')).toBeTruthy()
  })

  it('날짜를 선택하고 적용을 누르면 onChange가 호출되고 팝업이 닫힌다', () => {
    const handleChange = vi.fn()
    render(<DatePicker value={new Date(2026, 5, 19)} onChange={handleChange} />)

    fireEvent.click(screen.getByText('2026.06.19'))
    fireEvent.click(screen.getByText('20'))
    fireEvent.click(screen.getByText('적용'))

    expect(handleChange).toHaveBeenCalledTimes(1)
    const appliedDate = handleChange.mock.calls[0][0] as Date
    expect(appliedDate.getDate()).toBe(20)
    expect(appliedDate.getMonth()).toBe(5)
  })

  it('월 뷰에서 다른 달을 고르면 같은 일자를 유지한 채 일 뷰로 돌아온다', () => {
    const handleChange = vi.fn()
    render(<DatePicker value={new Date(2026, 5, 19)} onChange={handleChange} />)

    fireEvent.click(screen.getByText('2026.06.19'))
    fireEvent.click(screen.getByText('2026년 6월'))
    fireEvent.click(screen.getByText('8월'))

    expect(screen.getByText('2026년 8월')).toBeTruthy()

    fireEvent.click(screen.getByText('적용'))

    expect(handleChange).toHaveBeenCalledTimes(1)
    const appliedDate = handleChange.mock.calls[0][0] as Date
    expect(appliedDate.getMonth()).toBe(7)
    expect(appliedDate.getDate()).toBe(19)
  })

  it('선택된 날짜는 색상뿐 아니라 aria-pressed로도 구분된다', () => {
    render(<DatePicker value={new Date(2026, 5, 19)} onChange={() => {}} />)

    fireEvent.click(screen.getByText('2026.06.19'))

    const selectedDay = screen.getByRole('button', { name: '19' })
    expect(selectedDay.getAttribute('aria-pressed')).toBe('true')

    const otherDay = screen.getByRole('button', { name: '20' })
    expect(otherDay.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(otherDay)

    expect(selectedDay.getAttribute('aria-pressed')).toBe('false')
    expect(otherDay.getAttribute('aria-pressed')).toBe('true')
  })
})
