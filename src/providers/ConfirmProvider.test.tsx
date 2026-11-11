import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useConfirmStore } from '@/hooks/common/useConfirm'
import { ConfirmProvider } from './ConfirmProvider'

function openConfirm() {
  let result: Promise<boolean> = Promise.resolve(false)
  act(() => {
    result = useConfirmStore
      .getState()
      .open({ title: '이 후기를 삭제하시겠습니까?', confirmLabel: '삭제하기' })
  })
  return result
}

describe('ConfirmProvider', () => {
  beforeEach(() => {
    useConfirmStore.setState({ request: null, isOpen: false })
  })

  it('확인을 누르면 true로 끝나고 모달이 닫힌다', async () => {
    const user = userEvent.setup()
    render(<ConfirmProvider>{null}</ConfirmProvider>)

    const result = openConfirm()
    const dialog = await screen.findByRole('dialog', { name: '이 후기를 삭제하시겠습니까?' })
    await user.click(within(dialog).getByRole('button', { name: '삭제하기' }))

    await expect(result).resolves.toBe(true)
    expect(useConfirmStore.getState().isOpen).toBe(false)
  })

  it('취소를 누르면 false로 끝난다', async () => {
    const user = userEvent.setup()
    render(<ConfirmProvider>{null}</ConfirmProvider>)

    const result = openConfirm()
    await user.click(await screen.findByRole('button', { name: '취소' }))

    await expect(result).resolves.toBe(false)
  })

  it('Esc를 누르면 false로 끝난다', async () => {
    const user = userEvent.setup()
    render(<ConfirmProvider>{null}</ConfirmProvider>)

    const result = openConfirm()
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')

    await expect(result).resolves.toBe(false)
  })
})
