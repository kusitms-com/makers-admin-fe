import type { Meta, StoryObj } from '@storybook/react-vite'
import { MentoringListItem } from './MentoringListItem'

const meta = {
  title: 'mentoring/MentoringListItem',
  component: MentoringListItem,
  parameters: { layout: 'centered' },
  args: {
    mentor: { name: '김도윤', role: '멘토' },
    mentee: { name: '이서준', role: '멘티' },
    dateRange: '2026.05.12 14:00 - 2026.05.12 14:00',
    title: '[워크숍] 디자인 트렌드, 사용자 경험 개선',
    status: 'progress',
  },
  decorators: [
    (Story) => (
      <div className="w-[1106px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentoringListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Progress: Story = {
  args: { status: 'progress' },
}

export const Waiting: Story = {
  args: { status: 'waiting' },
}

export const Completed: Story = {
  args: { status: 'completed' },
}

export const LongTitle: Story = {
  args: {
    title:
      '[워크숍] 디자인 트렌드, 사용자 경험 개선 [워크숍] 디자인 트렌드, 사용자 경험 개선 [워크숍] 디자인 트렌드, 사용자 경험 개선',
  },
}
