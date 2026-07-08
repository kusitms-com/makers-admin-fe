import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MentoringListItem } from './MentoringListItem'

describe('MentoringListItem', () => {
  it('멘토와 멘티 이름, 역할을 렌더링한다', () => {
    render(
      <MentoringListItem
        mentor={{ name: '김도윤', role: '멘토' }}
        mentee={{ name: '이서준', role: '멘티' }}
        dateRange="2026.05.12 14:00 - 2026.05.12 14:00"
        title="[워크숍] 디자인 트렌드"
        status="progress"
      />,
    )

    expect(screen.getByText('김도윤')).toBeTruthy()
    expect(screen.getByText('멘토')).toBeTruthy()
    expect(screen.getByText('이서준')).toBeTruthy()
    expect(screen.getByText('멘티')).toBeTruthy()
  })

  it('일시와 제목을 렌더링한다', () => {
    render(
      <MentoringListItem
        mentor={{ name: '김도윤', role: '멘토' }}
        mentee={{ name: '이서준', role: '멘티' }}
        dateRange="2026.05.12 14:00 - 2026.05.12 14:00"
        title="[워크숍] 디자인 트렌드"
        status="progress"
      />,
    )

    expect(screen.getByText('2026.05.12 14:00 - 2026.05.12 14:00')).toBeTruthy()
    expect(screen.getByText('[워크숍] 디자인 트렌드')).toBeTruthy()
  })

  it('상태 칩을 렌더링한다', () => {
    render(
      <MentoringListItem
        mentor={{ name: '김도윤', role: '멘토' }}
        mentee={{ name: '이서준', role: '멘티' }}
        dateRange="2026.05.12 14:00 - 2026.05.12 14:00"
        title="[워크숍] 디자인 트렌드"
        status="completed"
      />,
    )

    expect(screen.getByText('완료')).toBeTruthy()
  })

  it('avatarUrl이 있으면 이미지를 렌더링한다', () => {
    const { container } = render(
      <MentoringListItem
        mentor={{ name: '김도윤', role: '멘토', avatarUrl: 'https://example.com/mentor.png' }}
        mentee={{ name: '이서준', role: '멘티' }}
        dateRange="2026.05.12 14:00 - 2026.05.12 14:00"
        title="[워크숍] 디자인 트렌드"
        status="progress"
      />,
    )

    const image = container.querySelector('img')
    expect(image?.getAttribute('src')).toBe('https://example.com/mentor.png')
  })
})
