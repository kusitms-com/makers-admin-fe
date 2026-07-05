import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartImageCard } from './PartImageCard'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23cbd5e1'/%3E%3C/svg%3E"

const meta = {
  title: 'introductions/PartImageCard',
  component: PartImageCard,
  parameters: { layout: 'centered' },
  args: {
    partLabel: '기획',
  },
} satisfies Meta<typeof PartImageCard>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Filled: Story = {
  args: { imageUrl: PLACEHOLDER_IMAGE },
}
