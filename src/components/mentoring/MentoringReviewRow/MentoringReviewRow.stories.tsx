import type { Meta, StoryObj } from '@storybook/react-vite'
import { MentoringReviewRow } from './MentoringReviewRow'

const meta = {
  title: 'mentoring/MentoringReviewRow',
  component: MentoringReviewRow,
  parameters: { layout: 'centered' },
  args: {
    title: '[워크숍] 디자인 트렌드, 사용자 경험 개선',
    relativeTime: '3일 전',
    mentor: { name: '정하늘', role: '멘토', generation: 30, part: 'FE' },
    mentee: { name: '이서준', role: '멘티', generation: 30, part: 'FE' },
    isRecommended: true,
    keywords: ['🧩 문제 해결을 잘 해요', '🗂️ 준비성이 좋아요', '✨ 피드백이 좋아요'],
    freeReview:
      '이번 멘토링을 통해 제 커리어 방향을 구체적으로 설계할 수 있었습니다. 혼자서 포트폴리오와 이력서를 점검할 때는 막연했던 부분들이, 현업 경험이 풍부한 멘토님의 세심한 피드백 덕분에 명확해졌습니다.',
  },
  decorators: [
    (Story) => (
      <div className="w-[765px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentoringReviewRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NotRecommended: Story = {
  args: { isRecommended: false, keywords: ['🗂️ 준비성이 좋아요'] },
}

export const LongTitle: Story = {
  args: {
    title:
      '[워크숍] 디자인 트렌드, 사용자 경험 개선 [워크숍] 디자인 트렌드, 사용자 경험 개선 [워크숍] 디자인 트렌드, 사용자 경험 개선',
  },
}
