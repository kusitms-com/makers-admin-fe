import type { Meta, StoryObj } from '@storybook/react-vite'
import { CohortBadge } from './CohortBadge'

const meta = {
  title: 'common/CohortBadge',
  component: CohortBadge,
  parameters: { layout: 'centered' },
  args: {
    generation: 33,
  },
} satisfies Meta<typeof CohortBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
