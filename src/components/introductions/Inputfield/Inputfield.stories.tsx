import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inputfield } from './Inputfield'

const meta = {
  title: 'introductions/Inputfield',
  component: Inputfield,
  parameters: { layout: 'centered' },
  args: {
    placeholder: '내용을 입력해주세요',
  },
} satisfies Meta<typeof Inputfield>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { value: '학회 소개 타이틀', readOnly: true },
}
