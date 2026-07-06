import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageUploadBox } from './ImageUploadBox'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='492' height='318'%3E%3Crect width='100%25' height='100%25' fill='%23cbd5e1'/%3E%3C/svg%3E"

const meta = {
  title: 'introductions/ImageUploadBox',
  component: ImageUploadBox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ImageUploadBox>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Filled: Story = {
  args: { imageUrl: PLACEHOLDER_IMAGE },
}
