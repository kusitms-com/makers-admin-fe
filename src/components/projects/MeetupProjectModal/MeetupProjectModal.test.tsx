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
    members: [],
    partOptions: PART_OPTIONS,
    onMemberPartChange: vi.fn(),
    onMemberRemove: vi.fn(),
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
  it('확정된 팀원마다 삭제하기 버튼을 보여준다', () => {
    renderModal({
      members: [
        { id: 'm1', part: 'PLAN', name: '홍길동' },
        { id: 'm2', part: 'PLAN', name: '김철수' },
      ],
    })

    expect(screen.getAllByRole('button', { name: '삭제하기' })).toHaveLength(2)
  })

  it('삭제하기 버튼 클릭 시 onMemberRemove가 해당 id로 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal({
      members: [{ id: 'm1', part: 'PLAN', name: '홍길동' }],
    })

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(props.onMemberRemove).toHaveBeenCalledWith('m1')
  })

  it('빈 이름 입력행의 추가하기 버튼은 비활성화된다', () => {
    renderModal()

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '추가하기' }).disabled).toBe(true)
  })

  it('이름을 입력하면 추가하기 버튼이 활성화되고, 클릭 시 onMemberAdd가 입력값으로 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.type(screen.getByPlaceholderText('이름'), '홍길동')
    const addButton = screen.getByRole<HTMLButtonElement>('button', { name: '추가하기' })
    expect(addButton.disabled).toBe(false)

    await user.click(addButton)

    expect(props.onMemberAdd).toHaveBeenCalledWith({ part: 'PLAN', name: '홍길동' })
  })

  it('추가 후 입력행이 초기화된다', async () => {
    const user = userEvent.setup()
    renderModal()

    const nameInput = screen.getByPlaceholderText<HTMLInputElement>('이름')
    await user.type(nameInput, '홍길동')
    await user.click(screen.getByRole('button', { name: '추가하기' }))

    expect(nameInput.value).toBe('')
  })

  it('저장하기(전체) 버튼이 saveDisabled일 때 비활성화된다', () => {
    renderModal({ saveDisabled: true })

    const saveButtons = screen.getAllByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButtons[saveButtons.length - 1].disabled).toBe(true)
  })
})
