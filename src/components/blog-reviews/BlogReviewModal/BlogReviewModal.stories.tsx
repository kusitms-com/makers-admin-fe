import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BlogReviewModal } from './BlogReviewModal'

const meta = {
  title: 'blog-reviews/BlogReviewModal',
  component: BlogReviewModal,
  parameters: { layout: 'centered' },
  args: {
    open: true,
    onOpenChange: () => {},
    cardinal: 33,
    part: 'PLAN',
    partOptions: [{ value: 'PLAN', label: '기획' }],
    onPartChange: () => {},
    activity: '',
    activityOptions: [{ value: 'SEMINAR', label: '세미나' }],
    onActivityChange: () => {},
    title: '',
    onTitleChange: () => {},
    link: '',
    onLinkChange: () => {},
    onCancel: () => {},
    onSave: () => {},
  },
} satisfies Meta<typeof BlogReviewModal>

export default meta
type Story = StoryObj<typeof meta>

const PART_OPTIONS = [
  { value: 'PLAN', label: '기획' },
  { value: 'DE', label: '디자인' },
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
]

const ACTIVITY_OPTIONS = [
  { value: 'SEMINAR', label: '세미나' },
  { value: 'WORKSHOP', label: '워크숍' },
]

function Demo() {
  const [open, setOpen] = useState(true)
  const [part, setPart] = useState('PLAN')
  const [activity, setActivity] = useState('')
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')

  return (
    <BlogReviewModal
      open={open}
      onOpenChange={setOpen}
      cardinal={33}
      part={part}
      partOptions={PART_OPTIONS}
      onPartChange={setPart}
      activity={activity}
      activityOptions={ACTIVITY_OPTIONS}
      onActivityChange={setActivity}
      title={title}
      onTitleChange={setTitle}
      link={link}
      onLinkChange={setLink}
      onCancel={() => {
        setOpen(false)
      }}
      onSave={() => {
        setOpen(false)
      }}
      saveDisabled={!activity || !title || !link}
    />
  )
}

export const Default: Story = {
  render: () => <Demo />,
}
