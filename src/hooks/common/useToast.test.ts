import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast, useToastStore } from './useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useToastStore.setState({ toasts: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('toast 호출 시 store에 항목이 추가된다', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current({ type: 'complete', message: '저장되었습니다' })
    })

    expect(useToastStore.getState().toasts).toHaveLength(1)
    expect(useToastStore.getState().toasts[0]).toMatchObject({
      type: 'complete',
      message: '저장되었습니다',
    })
  })

  it('일정 시간 후 자동으로 제거된다', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current({ type: 'info', message: '안내' })
    })
    expect(useToastStore.getState().toasts).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('여러 개를 추가하면 순서대로 쌓인다', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current({ type: 'complete', message: '첫번째' })
      result.current({ type: 'error', message: '두번째' })
    })

    const messages = useToastStore.getState().toasts.map((item) => item.message)
    expect(messages).toEqual(['첫번째', '두번째'])
  })

  it('removeToast로 특정 항목만 제거할 수 있다', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current({ type: 'complete', message: '첫번째' })
      result.current({ type: 'error', message: '두번째' })
    })

    const [first] = useToastStore.getState().toasts

    act(() => {
      useToastStore.getState().removeToast(first.id)
    })

    const messages = useToastStore.getState().toasts.map((item) => item.message)
    expect(messages).toEqual(['두번째'])
  })
})
