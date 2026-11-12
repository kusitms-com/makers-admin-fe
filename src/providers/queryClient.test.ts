import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { AxiosError } from 'axios'
import { ApiError } from '@api/client'
import { prefetchWhenAuthenticated, queryClient, shouldRetryQuery } from './queryClient'

afterEach(() => {
  queryClient.clear()
  useAuthStore.setState({ session: { status: 'loading' } })
})

describe('prefetchWhenAuthenticated', () => {
  it('로그인 상태면 기다리지 않고 요청을 시작한다', () => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'access', authority: 'MANAGER' },
    })
    const queryFn = vi.fn().mockResolvedValue(['row'])

    const result = prefetchWhenAuthenticated({ queryKey: ['test', 'list'], queryFn })

    expect(result).toBeNull()
    expect(queryFn).toHaveBeenCalledOnce()
  })

  it('로그인 전(복원 중 포함)에는 요청하지 않는다', () => {
    const queryFn = vi.fn().mockResolvedValue(['row'])

    prefetchWhenAuthenticated({ queryKey: ['test', 'list'], queryFn })
    useAuthStore.setState({ session: { status: 'guest' } })
    prefetchWhenAuthenticated({ queryKey: ['test', 'list'], queryFn })

    expect(queryFn).not.toHaveBeenCalled()
  })
})

describe('shouldRetryQuery', () => {
  it('네트워크 오류와 5xx는 한 번만 다시 시도한다', () => {
    expect(shouldRetryQuery(0, new AxiosError('Network Error'))).toBe(true)
    expect(shouldRetryQuery(0, new ApiError(503, 500, '서버 오류'))).toBe(true)
    expect(shouldRetryQuery(1, new ApiError(503, 500, '서버 오류'))).toBe(false)
  })

  it('다시 보내도 결과가 같은 4xx는 다시 시도하지 않는다', () => {
    expect(shouldRetryQuery(0, new ApiError(400, 400, '잘못된 요청'))).toBe(false)
    expect(shouldRetryQuery(0, new ApiError(403, 403, '권한 없음'))).toBe(false)
    expect(shouldRetryQuery(0, new ApiError(404, 404, '없음'))).toBe(false)
  })
})
