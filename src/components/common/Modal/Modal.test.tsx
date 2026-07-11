import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('open이 true면 title과 children을 보여준다', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p>본문 내용</p>
        </Modal.Body>
      </Modal>,
    )

    expect(screen.getByText('기업 프로젝트 등록')).toBeTruthy()
    expect(screen.getByText('본문 내용')).toBeTruthy()
  })

  it('open이 false면 렌더링하지 않는다', () => {
    render(
      <Modal open={false} onOpenChange={vi.fn()}>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p>본문 내용</p>
        </Modal.Body>
      </Modal>,
    )

    expect(screen.queryByText('본문 내용')).toBeNull()
  })

  it('Escape 키를 누르면 onOpenChange(false)가 호출된다', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p>본문 내용</p>
        </Modal.Body>
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it('backdrop을 클릭하면 onOpenChange(false)가 호출된다', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p>본문 내용</p>
        </Modal.Body>
      </Modal>,
    )

    await user.click(screen.getByTestId('modal-backdrop'))

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it('Modal.Footer를 전달하면 렌더링한다', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p>본문 내용</p>
        </Modal.Body>
        <Modal.Footer>
          <button type="button">저장하기</button>
        </Modal.Footer>
      </Modal>,
    )

    expect(screen.getByRole('button', { name: '저장하기' })).toBeTruthy()
  })
})
