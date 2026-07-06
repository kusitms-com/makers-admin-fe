import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectThumbnailCard } from './ProjectThumbnailCard'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='282' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23cbd5e1'/%3E%3C/svg%3E"

const meta = {
  title: 'projects/ProjectThumbnailCard',
  component: ProjectThumbnailCard,
  parameters: {
    layout: 'centered',
    docs: { description: { story: '마우스를 올리면 삭제 버튼 오버레이가 나타납니다.' } },
  },
  args: {
    imageUrl: PLACEHOLDER_IMAGE,
    serviceName: 'KU-CHECK',
  },
} satisfies Meta<typeof ProjectThumbnailCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
