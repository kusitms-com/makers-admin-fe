import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextareaField } from './TextareaField'

const meta = {
  title: 'common/TextareaField',
  component: TextareaField,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TextareaField>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { placeholder: '내용을 입력해주세요', className: 'w-[412px]' },
}
