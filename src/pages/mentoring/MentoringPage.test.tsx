import { render, screen, fireEvent } from '@testing-library/react'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { MentoringPage } from './MentoringPage'

describe('MentoringPage', () => {
  it('통계 카드와 오늘 날짜의 멘토링 현황을 표시한다', () => {
    render(<MentoringPage />)

    expect(screen.getByRole('heading', { name: '멘토링 관리' })).toBeTruthy()
    expect(screen.getByText('승인 대기 요청')).toBeTruthy()
    expect(screen.getByText('최근 후기')).toBeTruthy()
    expect(screen.getByText('활성멘토')).toBeTruthy()
    expect(screen.getByText('김도윤')).toBeTruthy()
    expect(screen.getByText('조하은')).toBeTruthy()
  })

  it('날짜 필터를 아무 멘토링도 없는 날짜로 바꾸면 빈 상태 문구를 표시한다', () => {
    render(<MentoringPage />)

    const today = dayjs()
    fireEvent.click(screen.getByRole('button', { name: dayjs().format('YYYY.MM.DD') }))
    fireEvent.click(screen.getByRole('button', { name: today.format('YYYY년 M월') }))
    fireEvent.click(screen.getByRole('button', { name: today.format('YYYY년') }))
    fireEvent.click(screen.getByRole('button', { name: String(today.year() - 3) }))
    fireEvent.click(screen.getByRole('button', { name: '1월' }))
    fireEvent.click(screen.getByRole('button', { name: '적용' }))

    expect(screen.getByText('선택한 날짜에 표시할 멘토링이 없습니다.')).toBeTruthy()
    expect(screen.queryByText('김도윤')).toBeNull()
  })
})
