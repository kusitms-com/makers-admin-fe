import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './Logo'

const meta = {
  title: 'common/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'lg'] },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
