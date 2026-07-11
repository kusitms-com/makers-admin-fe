import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ModalActions } from './ModalActions'

describe('ModalActions', () => {
  it('취소하기 클릭 시 onCancel이 호출된다', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ModalActions onCancel={onCancel} onSave={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '취소하기' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('saveDisabled가 true면 저장하기 버튼이 비활성화된다', () => {
    render(<ModalActions onCancel={vi.fn()} onSave={vi.fn()} saveDisabled />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it('saveDisabled가 false면 저장하기 클릭 시 onSave가 호출된다', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<ModalActions onCancel={vi.fn()} onSave={onSave} saveDisabled={false} />)

    await user.click(screen.getByRole('button', { name: '저장하기' }))

    expect(onSave).toHaveBeenCalledTimes(1)
  })
})
