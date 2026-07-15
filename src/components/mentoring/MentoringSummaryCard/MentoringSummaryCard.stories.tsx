import type { Meta, StoryObj } from '@storybook/react-vite'
import DashboardGraphIcon from '@/assets/icons/generated/DashboardGraphIcon'
import { MentoringSummaryCard } from './MentoringSummaryCard'

const meta = {
  title: 'mentoring/MentoringSummaryCard',
  component: MentoringSummaryCard,
  parameters: { layout: 'centered' },
  args: {
    label: '승인 대기 요청',
    count: 2,
    icon: <DashboardGraphIcon />,
  },
  decorators: [
    (Story) => (
      <div className="w-[374px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentoringSummaryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Clickable: Story = {
  args: { onClick: () => {} },
}
