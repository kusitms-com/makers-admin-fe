import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent } from 'storybook/test'
import { PartnerImageBox } from './PartnerImageBox'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23cbd5e1'/%3E%3C/svg%3E"

const meta = {
  title: 'introductions/PartnerImageBox',
  component: PartnerImageBox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PartnerImageBox>

export default meta
type Story = StoryObj<typeof meta>

export const Upload: Story = {}

export const Filled: Story = {
  args: { imageUrl: PLACEHOLDER_IMAGE },
  parameters: {
    docs: {
      description: {
        story:
          '마우스를 올리면 교체/삭제 버튼 오버레이가 나타납니다. hover 상태 자체는 Hovered 스토리 참고.',
      },
    },
  },
}

export const Hovered: Story = {
  args: { imageUrl: PLACEHOLDER_IMAGE },
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('div')
    if (container) {
      await userEvent.hover(container)
    }
  },
}
