import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SelectField } from './SelectField'

const meta = {
  title: 'common/SelectField',
  component: SelectField,
  parameters: { layout: 'centered' },
  args: {
    value: 'PLAN',
    options: [{ value: 'PLAN', label: '기획' }],
  },
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

const OPTIONS = [
  { value: 'PLAN', label: '기획' },
  { value: 'DE', label: '디자인' },
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
]

export const Static: Story = {
  args: { value: '33기', options: [], className: 'w-[130px]' },
}

export const Interactive: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('PLAN')
      return (
        <SelectField value={value} options={OPTIONS} onValueChange={setValue} className="w-40" />
      )
    }
    return <Demo />
  },
}

export const Placeholder: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('')
      return (
        <SelectField
          value={value}
          options={OPTIONS}
          onValueChange={setValue}
          placeholder="활동을 선택해주세요"
          className="w-64"
        />
      )
    }
    return <Demo />
  },
}
