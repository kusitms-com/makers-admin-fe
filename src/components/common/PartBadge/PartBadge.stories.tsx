import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartBadge } from './PartBadge'

const meta = {
  title: 'common/PartBadge',
  component: PartBadge,
  parameters: { layout: 'centered' },
  argTypes: {
    part: { control: 'select', options: ['PLAN', 'DE', 'FE', 'BE'] },
  },
  args: {
    part: 'PLAN',
  },
} satisfies Meta<typeof PartBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Plan: Story = { args: { part: 'PLAN' } }
export const Design: Story = { args: { part: 'DE' } }
export const Frontend: Story = { args: { part: 'FE' } }
export const Backend: Story = { args: { part: 'BE' } }

export const AllParts: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <PartBadge part="PLAN" />
      <PartBadge part="DE" />
      <PartBadge part="FE" />
      <PartBadge part="BE" />
    </div>
  ),
}
