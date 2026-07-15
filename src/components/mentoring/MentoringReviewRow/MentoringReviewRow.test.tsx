import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MentoringReviewRow } from './MentoringReviewRow'

const baseProps = {
  title: '[워크숍] 디자인 트렌드, 사용자 경험 개선',
  relativeTime: '3일 전',
  mentor: { name: '정하늘', role: '멘토', generation: 30, part: 'FE' } as const,
  mentee: { name: '이서준', role: '멘티', generation: 30, part: 'FE' } as const,
  keywords: ['🗂️ 준비성이 좋아요'],
  freeReview: '멘토링이 정말 도움이 되었습니다.',
}

describe('MentoringReviewRow', () => {
  it('제목과 작성 시점을 렌더링한다', () => {
    render(<MentoringReviewRow {...baseProps} isRecommended={true} />)

    expect(screen.getByText('[워크숍] 디자인 트렌드, 사용자 경험 개선')).toBeTruthy()
    expect(screen.getByText('3일 전')).toBeTruthy()
  })

  it('멘토와 멘티 메타 정보를 렌더링한다', () => {
    render(<MentoringReviewRow {...baseProps} isRecommended={true} />)

    expect(screen.getByText('정하늘 멘토')).toBeTruthy()
    expect(screen.getByText('이서준 멘티')).toBeTruthy()
  })

  it('isRecommended가 true면 추천 칩을 렌더링한다', () => {
    render(<MentoringReviewRow {...baseProps} isRecommended={true} />)

    expect(screen.getByText('👍 추천해요')).toBeTruthy()
  })

  it('isRecommended가 false면 추천 칩을 렌더링하지 않는다', () => {
    render(<MentoringReviewRow {...baseProps} isRecommended={false} />)

    expect(screen.queryByText('👍 추천해요')).toBeNull()
  })

  it('키워드와 자유 후기를 렌더링한다', () => {
    render(<MentoringReviewRow {...baseProps} isRecommended={true} />)

    expect(screen.getByText('🗂️ 준비성이 좋아요')).toBeTruthy()
    expect(screen.getByText('멘토링이 정말 도움이 되었습니다.')).toBeTruthy()
  })
})
