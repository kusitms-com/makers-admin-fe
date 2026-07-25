import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BlogReviewModal } from './BlogReviewModal'

const PART_OPTIONS = [
  { value: 'PLAN', label: '기획' },
  { value: 'DE', label: '디자인' },
]

const ACTIVITY_OPTIONS = [{ value: 'SEMINAR', label: '세미나' }]

function renderModal(overrides: Partial<Parameters<typeof BlogReviewModal>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    cardinal: 33,
    part: 'PLAN',
    partOptions: PART_OPTIONS,
    onPartChange: vi.fn(),
    activity: '',
    activityOptions: ACTIVITY_OPTIONS,
    onActivityChange: vi.fn(),
    title: '',
    onTitleChange: vi.fn(),
    link: '',
    onLinkChange: vi.fn(),
    onThumbnailChange: vi.fn(),
    onThumbnailDelete: vi.fn(),
    onCancel: vi.fn(),
    onSave: vi.fn(),
    ...overrides,
  }
  render(<BlogReviewModal {...props} />)
  return props
}

describe('BlogReviewModal', () => {
  it('제목과 필드를 보여준다', () => {
    renderModal()

    expect(screen.getByText('블로그 후기 등록')).toBeTruthy()
    expect(screen.getByText('33기')).toBeTruthy()
    expect(screen.getByText('활동을 선택해주세요')).toBeTruthy()
    expect(screen.getByPlaceholderText('제목을 입력해주세요')).toBeTruthy()
    expect(screen.getByPlaceholderText('링크를 업로드해주세요')).toBeTruthy()
  })

  it('제목을 입력하면 onTitleChange가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.type(screen.getByPlaceholderText('제목을 입력해주세요'), 'A')

    expect(props.onTitleChange).toHaveBeenCalledWith('A')
  })

  it('링크를 입력하면 onLinkChange가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.type(screen.getByPlaceholderText('링크를 업로드해주세요'), 'h')

    expect(props.onLinkChange).toHaveBeenCalledWith('h')
  })

  it('파트 드롭다운에서 값을 선택하면 onPartChange가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    const [partCombobox] = screen.getAllByRole('combobox')
    await user.click(partCombobox)
    await user.click(await screen.findByRole('option', { name: '디자인' }))

    expect(props.onPartChange).toHaveBeenCalledWith('DE')
  })

  it('활동 드롭다운에서 값을 선택하면 onActivityChange가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    const [, activityCombobox] = screen.getAllByRole('combobox')
    await user.click(activityCombobox)
    await user.click(await screen.findByRole('option', { name: '세미나' }))

    expect(props.onActivityChange).toHaveBeenCalledWith('SEMINAR')
  })

  it('썸네일 파일을 선택하면 onThumbnailChange가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    const file = new File(['content'], 'thumbnail.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('파일 선택'), file)

    expect(props.onThumbnailChange).toHaveBeenCalledWith(file)
  })

  it('썸네일 삭제하기 클릭 시 onThumbnailDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal({ thumbnailUrl: '/thumbnail.png' })

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(props.onThumbnailDelete).toHaveBeenCalledTimes(1)
  })

  it('취소하기 클릭 시 onCancel이 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.click(screen.getByRole('button', { name: '취소하기' }))

    expect(props.onCancel).toHaveBeenCalledTimes(1)
  })

  it('saveDisabled가 true면 저장하기 버튼이 비활성화된다', () => {
    renderModal({ saveDisabled: true })

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it('saveDisabled가 false면 저장하기 버튼이 활성화되고 클릭 시 onSave가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal({ saveDisabled: false })

    const saveButton = screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    expect(props.onSave).toHaveBeenCalledTimes(1)
  })
})
