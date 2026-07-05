import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageBoxThumbnail } from './ImageBoxThumbnail'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23cbd5e1'/%3E%3C/svg%3E"

const meta = {
  title: 'introductions/ImageBoxThumbnail',
  component: ImageBoxThumbnail,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['m', 'l'] },
  },
} satisfies Meta<typeof ImageBoxThumbnail>

export default meta
type Story = StoryObj<typeof meta>

export const UploadM: Story = { args: { size: 'm' } }
export const UploadL: Story = { args: { size: 'l' } }
export const ImageM: Story = { args: { size: 'm', imageUrl: PLACEHOLDER_IMAGE } }
export const ImageL: Story = { args: { size: 'l', imageUrl: PLACEHOLDER_IMAGE } }
