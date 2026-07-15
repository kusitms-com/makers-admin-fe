import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MentorSatisfactionRow } from './MentorSatisfactionRow'

describe('MentorSatisfactionRow', () => {
  it('멘토 이름, 기수, 파트를 렌더링한다', () => {
    render(<MentorSatisfactionRow name="정하늘" generation={28} part="FE" satisfactionRate={88} />)

    expect(screen.getByText('정하늘 멘토')).toBeTruthy()
    expect(screen.getByText('28기')).toBeTruthy()
    expect(screen.getByText('FE')).toBeTruthy()
  })

  it('만족도 퍼센트를 렌더링한다', () => {
    render(<MentorSatisfactionRow name="정하늘" generation={28} part="FE" satisfactionRate={88} />)

    expect(screen.getByText('88%')).toBeTruthy()
  })

  it('상한을 벗어난 만족도를 100으로 clamp한다', () => {
    render(<MentorSatisfactionRow name="정하늘" generation={28} part="FE" satisfactionRate={120} />)

    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('하한을 벗어난 만족도를 0으로 clamp한다', () => {
    render(<MentorSatisfactionRow name="정하늘" generation={28} part="FE" satisfactionRate={-1} />)

    expect(screen.getByText('0%')).toBeTruthy()
  })

  it('만족도가 NaN이면 0으로 처리한다', () => {
    render(<MentorSatisfactionRow name="정하늘" generation={28} part="FE" satisfactionRate={NaN} />)

    expect(screen.getByText('0%')).toBeTruthy()
  })

  it('avatarUrl이 있으면 이미지를 렌더링한다', () => {
    const { container } = render(
      <MentorSatisfactionRow
        name="정하늘"
        generation={28}
        part="FE"
        satisfactionRate={88}
        avatarUrl="https://example.com/mentor.png"
      />,
    )

    const image = container.querySelector('img')
    expect(image?.getAttribute('src')).toBe('https://example.com/mentor.png')
  })
})
