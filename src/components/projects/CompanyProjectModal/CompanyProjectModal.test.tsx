import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CompanyProjectModal } from './CompanyProjectModal'

function renderModal(overrides: Partial<Parameters<typeof CompanyProjectModal>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    cardinal: 33,
    name: '',
    onNameChange: vi.fn(),
    content: '',
    onContentChange: vi.fn(),
    onCancel: vi.fn(),
    onSave: vi.fn(),
    ...overrides,
  }
  render(<CompanyProjectModal {...props} />)
  return props
}

describe('CompanyProjectModal', () => {
  it('제목과 필드를 보여준다', () => {
    renderModal()

    expect(screen.getByText('기업 프로젝트 등록')).toBeTruthy()
    expect(screen.getByText('33기')).toBeTruthy()
    expect(screen.getByPlaceholderText('기업 이름을 입력해주세요')).toBeTruthy()
    expect(screen.getByPlaceholderText('프로젝트 소개를 입력해주세요')).toBeTruthy()
  })

  it('기업 이름을 입력하면 onNameChange가 호출된다', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.type(screen.getByPlaceholderText('기업 이름을 입력해주세요'), 'A')

    expect(props.onNameChange).toHaveBeenCalledWith('A')
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
