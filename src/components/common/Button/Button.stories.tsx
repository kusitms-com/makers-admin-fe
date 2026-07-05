import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'common/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'strong', 'error', 'disable', 'outlined'],
    },
    size: { control: 'select', options: ['s', 'm', 'l', 'xl'] },
  },
  args: {
    children: '버튼',
    variant: 'strong',
    size: 'm',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Strong: Story = { args: { variant: 'strong' } }
export const Primary: Story = { args: { variant: 'primary' } }
export const Outlined: Story = { args: { variant: 'outlined' } }
export const Error: Story = { args: { variant: 'error' } }
export const Disabled: Story = { args: { variant: 'disable' } }

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="s" />
      <Button {...args} size="m" />
      <Button {...args} size="l" />
      <Button {...args} size="xl" />
    </div>
  ),
}
