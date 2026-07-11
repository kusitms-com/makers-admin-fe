import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MeetupProjectModal, type MeetupTeamMember } from './MeetupProjectModal'

const meta = {
  title: 'projects/MeetupProjectModal',
  component: MeetupProjectModal,
  parameters: { layout: 'centered' },
  args: {
    open: true,
    onOpenChange: () => {},
    cardinal: 33,
    type: 'WEB',
    typeOptions: [{ value: 'WEB', label: 'Web' }],
    onTypeChange: () => {},
    name: '',
    onNameChange: () => {},
    oneLineIntro: '',
    onOneLineIntroChange: () => {},
    intro: '',
    onIntroChange: () => {},
    members: [],
    partOptions: [{ value: 'PLAN', label: '기획' }],
    onMemberPartChange: () => {},
    onMemberRemove: () => {},
    onMemberAdd: () => {},
    githubUrl: '',
    onGithubUrlChange: () => {},
    behanceUrl: '',
    onBehanceUrlChange: () => {},
    appUrl: '',
    onAppUrlChange: () => {},
    onCancel: () => {},
    onSave: () => {},
  },
} satisfies Meta<typeof MeetupProjectModal>

export default meta
type Story = StoryObj<typeof meta>

const TYPE_OPTIONS = [
  { value: 'WEB', label: 'Web' },
  { value: 'APP', label: 'App' },
]

const PART_OPTIONS = [
  { value: 'PLAN', label: '기획' },
  { value: 'DE', label: '디자인' },
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
]

let memberSeq = 0
function createMember(part: string, name: string): MeetupTeamMember {
  memberSeq += 1
  return { id: `member-${String(memberSeq)}`, part, name }
}

function Demo() {
  const [open, setOpen] = useState(true)
  const [type, setType] = useState('WEB')
  const [name, setName] = useState('')
  const [oneLineIntro, setOneLineIntro] = useState('')
  const [intro, setIntro] = useState('')
  const [members, setMembers] = useState<MeetupTeamMember[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [behanceUrl, setBehanceUrl] = useState('')
  const [appUrl, setAppUrl] = useState('')

  return (
    <MeetupProjectModal
      open={open}
      onOpenChange={setOpen}
      cardinal={33}
      type={type}
      typeOptions={TYPE_OPTIONS}
      onTypeChange={setType}
      name={name}
      onNameChange={setName}
      oneLineIntro={oneLineIntro}
      onOneLineIntroChange={setOneLineIntro}
      intro={intro}
      onIntroChange={setIntro}
      members={members}
      partOptions={PART_OPTIONS}
      onMemberPartChange={(id, value) => {
        setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, part: value } : m)))
      }}
      onMemberRemove={(id) => {
        setMembers((prev) => prev.filter((m) => m.id !== id))
      }}
      onMemberAdd={({ part, name: memberName }) => {
        setMembers((prev) => [...prev, createMember(part, memberName)])
      }}
      githubUrl={githubUrl}
      onGithubUrlChange={setGithubUrl}
      behanceUrl={behanceUrl}
      onBehanceUrlChange={setBehanceUrl}
      appUrl={appUrl}
      onAppUrlChange={setAppUrl}
      onCancel={() => {
        setOpen(false)
      }}
      onSave={() => {
        setOpen(false)
      }}
      saveDisabled={!name}
    />
  )
}

export const Default: Story = {
  render: () => <Demo />,
}
