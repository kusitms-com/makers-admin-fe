import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from '@/hooks/common/useToast'
import { ToastProvider } from './ToastProvider'

describe('ToastProvider', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('children을 그대로 렌더링한다', () => {
    render(
      <ToastProvider>
        <div>메인 콘텐츠</div>
      </ToastProvider>,
    )

    expect(screen.getByText('메인 콘텐츠')).toBeTruthy()
  })

  it('store에 있는 toast를 화면에 렌더링한다', () => {
    useToastStore.setState({
      toasts: [{ id: '1', type: 'complete', message: '저장되었습니다' }],
    })

    render(<ToastProvider>{null}</ToastProvider>)

    expect(screen.getByText('저장되었습니다')).toBeTruthy()
  })

  it('여러 toast를 store에 담긴 순서대로 렌더링한다', () => {
    useToastStore.setState({
      toasts: [
        { id: '1', type: 'complete', message: '첫번째' },
        { id: '2', type: 'error', message: '두번째' },
      ],
    })

    render(<ToastProvider>{null}</ToastProvider>)

    expect(screen.getAllByRole('status').map((el) => el.textContent)).toEqual(['첫번째'])
    expect(screen.getByRole('alert').textContent).toBe('두번째')
  })
})
