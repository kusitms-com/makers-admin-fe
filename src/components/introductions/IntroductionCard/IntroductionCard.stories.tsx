import type { Meta, StoryObj } from '@storybook/react-vite'
import { IntroductionCard } from './IntroductionCard'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23cbd5e1'/%3E%3C/svg%3E"

const meta = {
  title: 'introductions/IntroductionCard',
  component: IntroductionCard,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'active'] },
  },
} satisfies Meta<typeof IntroductionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { variant: 'default' } }

export const Filled: Story = {
  args: {
    variant: 'active',
    title: '학회 소개',
    description: 'KUSITMS는 IT 연합동아리입니다.',
    thumbnailUrl: PLACEHOLDER_IMAGE,
  },
}
