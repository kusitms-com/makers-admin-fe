import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MentorApplicationRow } from './MentorApplicationRow'

const STATUS_OPTIONS = [
  { value: 'pending', label: '대기' },
  { value: 'accepted', label: '합격' },
  { value: 'rejected', label: '거절' },
]

function ControlledMentorApplicationRow(
  props: Omit<
    React.ComponentProps<typeof MentorApplicationRow>,
    'status' | 'statusOptions' | 'onStatusChange'
  >,
) {
  const [status, setStatus] = useState('rejected')
  return (
    <MentorApplicationRow
      {...props}
      status={status}
      statusOptions={STATUS_OPTIONS}
      onStatusChange={setStatus}
    />
  )
}

const meta = {
  title: 'mentoring/MentorApplicationRow',
  component: MentorApplicationRow,
  parameters: { layout: 'centered' },
  args: {
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    phone: '010-1234-5678',
    email: 'abc12345@gmail.com',
    appliedAt: '26.03.12 18:33',
    isApplied: true,
    status: 'rejected',
    statusOptions: STATUS_OPTIONS,
    onStatusChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[1155px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentorApplicationRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <ControlledMentorApplicationRow {...args} />,
}

export const WithFile: Story = {
  render: (args) => <ControlledMentorApplicationRow {...args} fileName="수료증_이현진.pdf" />,
}

export const NotApplied: Story = {
  render: (args) => <ControlledMentorApplicationRow {...args} isApplied={false} />,
}
