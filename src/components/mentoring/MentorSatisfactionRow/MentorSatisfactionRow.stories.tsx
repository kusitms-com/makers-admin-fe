import type { Meta, StoryObj } from '@storybook/react-vite'
import { MentorSatisfactionRow } from './MentorSatisfactionRow'

const meta = {
  title: 'mentoring/MentorSatisfactionRow',
  component: MentorSatisfactionRow,
  parameters: { layout: 'centered' },
  args: {
    name: '정하늘',
    generation: 28,
    part: 'FE',
    satisfactionRate: 88,
  },
  decorators: [
    (Story) => (
      <div className="w-[387px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentorSatisfactionRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAvatar: Story = {
  args: { avatarUrl: 'https://i.pravatar.cc/72' },
}

export const LowSatisfaction: Story = {
  args: { satisfactionRate: 32 },
}
