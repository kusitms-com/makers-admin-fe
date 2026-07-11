import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CompanyProjectModal } from './CompanyProjectModal'

const meta = {
  title: 'projects/CompanyProjectModal',
  component: CompanyProjectModal,
  parameters: { layout: 'centered' },
  args: {
    open: true,
    onOpenChange: () => {},
    cardinal: 33,
    name: '',
    onNameChange: () => {},
    content: '',
    onContentChange: () => {},
    onCancel: () => {},
    onSave: () => {},
  },
} satisfies Meta<typeof CompanyProjectModal>

export default meta
type Story = StoryObj<typeof meta>

function Demo() {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  return (
    <CompanyProjectModal
      open={open}
      onOpenChange={setOpen}
      cardinal={33}
      name={name}
      onNameChange={setName}
      content={content}
      onContentChange={setContent}
      onCancel={() => {
        setOpen(false)
      }}
      onSave={() => {
        setOpen(false)
      }}
      saveDisabled={!name || !content}
    />
  )
}

export const Default: Story = {
  render: () => <Demo />,
}
