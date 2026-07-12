import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toast } from './Toast'

const meta = {
  title: 'common/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  argTypes: {
    type: { control: 'select', options: ['complete', 'warning', 'info', 'error'] },
  },
  args: {
    type: 'complete',
    message: '메시지를 입력해주세요',
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Complete: Story = { args: { type: 'complete' } }
export const Warning: Story = { args: { type: 'warning' } }
export const Info: Story = { args: { type: 'info' } }
export const Error: Story = { args: { type: 'error' } }

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3 bg-neutral-700 p-6">
      <Toast type="complete" message="메시지를 입력해주세요" />
      <Toast type="warning" message="메시지를 입력해주세요" />
      <Toast type="info" message="메시지를 입력해주세요" />
      <Toast type="error" message="메시지를 입력해주세요" />
    </div>
  ),
}
