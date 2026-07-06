import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SegmentedControl, type SegmentedControlItem } from './SegmentedControl'

const ITEMS: SegmentedControlItem[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'approved', label: '승인' },
]

function ControlledSegmentedControl() {
  const [value, setValue] = useState(ITEMS[0].value)
  return <SegmentedControl items={ITEMS} value={value} onValueChange={setValue} />
}

const meta = {
  title: 'common/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
  args: {
    items: ITEMS,
    value: ITEMS[0].value,
    onValueChange: () => {},
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlledSegmentedControl />,
}
