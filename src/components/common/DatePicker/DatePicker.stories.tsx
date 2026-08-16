import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from './DatePicker'

function ControlledDatePicker() {
  const [value, setValue] = useState(new Date('2026-06-19'))
  return <DatePicker value={value} onChange={setValue} />
}

const meta = {
  title: 'common/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  args: {
    value: new Date('2026-06-19'),
    onChange: () => {},
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlledDatePicker />,
}
