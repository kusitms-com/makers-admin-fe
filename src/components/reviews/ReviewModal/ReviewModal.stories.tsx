import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ReviewModal } from './ReviewModal'

const meta = {
  title: 'reviews/ReviewModal',
  component: ReviewModal,
  parameters: { layout: 'centered' },
  args: {
    open: true,
    onOpenChange: () => {},
    cardinal: 33,
    team: 'PLAN',
    teamOptions: [{ value: 'PLAN', label: '기획' }],
    onTeamChange: () => {},
    name: '',
    onNameChange: () => {},
    review: '',
    onReviewChange: () => {},
    onCancel: () => {},
    onSave: () => {},
  },
} satisfies Meta<typeof ReviewModal>

export default meta
type Story = StoryObj<typeof meta>

const TEAM_OPTIONS = [
  { value: 'PLAN', label: '기획' },
  { value: 'DE', label: '디자인' },
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
]

function Demo() {
  const [open, setOpen] = useState(true)
  const [team, setTeam] = useState('PLAN')
  const [name, setName] = useState('')
  const [review, setReview] = useState('')

  return (
    <ReviewModal
      open={open}
      onOpenChange={setOpen}
      cardinal={33}
      team={team}
      teamOptions={TEAM_OPTIONS}
      onTeamChange={setTeam}
      name={name}
      onNameChange={setName}
      review={review}
      onReviewChange={setReview}
      onCancel={() => {
        setOpen(false)
      }}
      onSave={() => {
        setOpen(false)
      }}
      saveDisabled={!name || !review}
    />
  )
}

export const Default: Story = {
  render: () => <Demo />,
}
