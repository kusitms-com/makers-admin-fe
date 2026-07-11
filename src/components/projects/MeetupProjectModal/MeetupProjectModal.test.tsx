import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MeetupProjectModal } from './MeetupProjectModal'

const TYPE_OPTIONS = [
  { value: 'WEB', label: 'Web' },
  { value: 'APP', label: 'App' },
]

const PART_OPTIONS = [{ value: 'PLAN', label: '기획' }]

function renderModal(overrides: Partial<Parameters<typeof MeetupProjectModal>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    cardinal: 33,
    type: 'WEB',
    typeOptions: TYPE_OPTIONS,
    onTypeChange: vi.fn(),
    name: '',
    onNameChange: vi.fn(),
    oneLineIntro: '',
    onOneLineIntroChange: vi.fn(),
    intro: '',
    onIntroChange: vi.fn(),
    members: [{ id: 'm1', part: 'PLAN', name: '' }],
    partOptions: PART_OPTIONS,
    onMemberPartChange: vi.fn(),
    onMemberNameChange: vi.fn(),
    onMemberAdd: vi.fn(),
    githubUrl: '',
    onGithubUrlChange: vi.fn(),
    behanceUrl: '',
    onBehanceUrlChange: vi.fn(),
    appUrl: '',
    onAppUrlChange: vi.fn(),
    onCancel: vi.fn(),
    onSave: vi.fn(),
    ...overrides,
  }
  render(<MeetupProjectModal {...props} />)
  return props
}

describe('MeetupProjectModal', () => {
  it('팀원 행마다 저장하기 버튼을 보여준다', () => {
    renderModal({
      members: [
        { id: 'm1', part: 'PLAN', name: '홍길동' },
        { id: 'm2', part: 'DE', name: '' },
      ],
    })

    expect(screen.getAllByRole('button', { name: '저장하기' })).toHaveLength(3)
  })

  it('팀원 이름이 비어있으면 해당 행 저장하기 버튼이 비활성화된다', () => {
    renderModal({ members: [{ id: 'm1', part: 'PLAN', name: '' }] })

    const [memberSaveButton] = screen.getAllByRole<HTMLButtonElement>('button', {
      name: '저장하기',
    })
    expect(memberSaveButton.disabled).toBe(true)
  })

  it('팀원 이름이 채워지면 해당 행 저장하기 버튼이 활성화된다', () => {
    renderModal({ members: [{ id: 'm1', part: 'PLAN', name: '홍길동' }] })

    const [memberSaveButton] = screen.getAllByRole<HTMLButtonElement>('button', {
      name: '저장하기',
    })
    expect(memberSaveButton.disabled).toBe(false)
  })

  it('추가하기 버튼 클릭 시 onMemberAdd가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.click(screen.getByRole('button', { name: '추가하기' }))

    expect(props.onMemberAdd).toHaveBeenCalledTimes(1)
  })

  it('저장하기(전체) 버튼이 saveDisabled일 때 비활성화된다', () => {
    renderModal({ saveDisabled: true })

    const saveButtons = screen.getAllByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButtons[saveButtons.length - 1].disabled).toBe(true)
  })
})
