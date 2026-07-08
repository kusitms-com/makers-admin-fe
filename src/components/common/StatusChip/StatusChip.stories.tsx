import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusChip } from './StatusChip'

const meta = {
  title: 'common/StatusChip',
  component: StatusChip,
  parameters: { layout: 'centered' },
  argTypes: {
    status: { control: 'select', options: ['progress', 'waiting', 'completed'] },
  },
  args: {
    status: 'progress',
  },
} satisfies Meta<typeof StatusChip>

export default meta
type Story = StoryObj<typeof meta>

export const Progress: Story = { args: { status: 'progress' } }
export const Waiting: Story = { args: { status: 'waiting' } }
export const Completed: Story = { args: { status: 'completed' } }

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <StatusChip status="progress" />
      <StatusChip status="waiting" />
      <StatusChip status="completed" />
    </div>
  ),
}
