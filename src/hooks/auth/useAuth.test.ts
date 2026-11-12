import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './useAuth'

const responseData = {
  accessToken: 'new-access',
  refreshToken: 'new-refresh',
  authority: 'MANAGER',
}
const refreshTokenKey = 'kusitms-admin-refresh-token'

function respondWith(data: unknown, status = 200) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ code: status, message: '요청 결과', data }), { status }),
      ),
    )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test')
  sessionStorage.clear()
  useAuthStore.setState({ session: { status: 'guest' } })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  sessionStorage.clear()
})

describe('관리자 세션', () => {
  it('MANAGER 로그인 후 액세스 토큰은 메모리에, 리프레시 토큰은 세션 저장소에 둔다', async () => {
    respondWith(responseData)

    await useAuthStore.getState().login('admin', 'password')

    expect(useAuthStore.getState().session).toEqual({
      status: 'authenticated',
      accessToken: 'new-access',
      authority: 'MANAGER',
    })
    expect(sessionStorage.getItem(refreshTokenKey)).toBe('new-refresh')
    expect(sessionStorage.length).toBe(1)
  })

  it('MEMBER 계정은 토큰을 저장하지 않고 관리자 세션을 만들지 않는다', async () => {
    respondWith({ ...responseData, authority: 'MEMBER' })

    await expect(useAuthStore.getState().login('member', 'password')).rejects.toMatchObject({
      status: 403,
    })

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBeNull()
  })

  it('저장된 리프레시 토큰으로 세션을 복원하고 갱신된 토큰으로 교체한다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'old-refresh')
    const fetchMock = respondWith({ ...responseData, authority: 'OWNER' })

    await useAuthStore.getState().restore()

    // axios fetch 어댑터는 fetch(Request)로 호출한다.
    const request = fetchMock.mock.calls[0]?.[0]
    if (!(request instanceof Request)) throw new Error('fetch가 Request로 호출되지 않았습니다.')
    expect(request.url).toBe('https://api.example.test/api/auth/refresh')
    expect(await request.text()).toBe(JSON.stringify({ refreshToken: 'old-refresh' }))
    expect(useAuthStore.getState().session).toEqual({
      status: 'authenticated',
      accessToken: 'new-access',
      authority: 'OWNER',
    })
    expect(sessionStorage.getItem(refreshTokenKey)).toBe('new-refresh')
  })

  it('리프레시 토큰이 없으면 요청 없이 비로그인 상태가 된다', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    await useAuthStore.getState().restore()

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('토큰 갱신이 실패하면 저장된 리프레시 토큰을 지운다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'expired-refresh')
    respondWith(null, 401)

    await useAuthStore.getState().restore()

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBeNull()
  })

  it('서버 오류(5xx)로 복원에 실패해도 리프레시 토큰은 남겨 두어 다시 시도할 수 있다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'valid-refresh')
    respondWith(null, 503)

    await useAuthStore.getState().restore()

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBe('valid-refresh')
  })

  it('네트워크 오류로 복원에 실패해도 리프레시 토큰은 남겨 둔다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'valid-refresh')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')),
    )

    await useAuthStore.getState().restore()

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBe('valid-refresh')
  })

  it('서버 로그아웃이 실패해도 로컬 세션을 제거한다', async () => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'access', authority: 'MANAGER' },
    })
    sessionStorage.setItem(refreshTokenKey, 'refresh')
    respondWith(null, 500)

    await expect(useAuthStore.getState().logout()).rejects.toMatchObject({ status: 500 })

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBeNull()
  })

  it('로그아웃 요청이 401이면 토큰을 한 번 갱신해 다시 요청한다', async () => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'expired-access', authority: 'MANAGER' },
    })
    sessionStorage.setItem(refreshTokenKey, 'stored-refresh')
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 401, message: '만료', data: null }), { status: 401 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 200, message: '성공', data: responseData }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 200, message: '성공', data: null }), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await useAuthStore.getState().logout()

    expect(
      fetchMock.mock.calls.map(([url]) => new URL(url instanceof Request ? url.url : url).pathname),
    ).toEqual(['/api/auth/logout', '/api/auth/refresh', '/api/auth/logout'])
    const retried = fetchMock.mock.calls[2]?.[0]
    expect(retried instanceof Request ? retried.headers.get('Authorization') : null).toBe(
      'Bearer new-access',
    )
    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBeNull()
  })

  it('토큰 갱신 중 리프레시 토큰이 거부되면 로그아웃 상태로 바꾼다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'expired-refresh')
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'old', authority: 'MANAGER' },
    })
    respondWith(null, 401)

    await expect(useAuthStore.getState().refreshAccessToken()).rejects.toMatchObject({
      status: 401,
    })

    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBeNull()
  })

  it('토큰 갱신이 서버 오류(5xx)로 실패하면 세션을 유지한다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'refresh')
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'old', authority: 'MANAGER' },
    })
    respondWith(null, 503)

    await expect(useAuthStore.getState().refreshAccessToken()).rejects.toMatchObject({
      status: 503,
    })

    expect(useAuthStore.getState().session.status).toBe('authenticated')
    expect(sessionStorage.getItem(refreshTokenKey)).toBe('refresh')
  })

  it('토큰 갱신을 기다리는 동안 로그아웃하면 갱신 결과로 세션을 되살리지 않는다', async () => {
    sessionStorage.setItem(refreshTokenKey, 'refresh')
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'old', authority: 'MANAGER' },
    })
    let resolveRefresh: (response: Response) => void = () => undefined
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveRefresh = resolve
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const refreshing = useAuthStore.getState().refreshAccessToken()
    // 인터셉터가 비동기라 갱신 요청이 실제로 나갈 때까지 기다린다.
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledOnce()
    })
    // 서버 로그아웃 요청은 기다리지 않고 로컬 세션만 먼저 비운다(logout은 세션을 먼저 guest로 바꾼다).
    sessionStorage.removeItem(refreshTokenKey)
    useAuthStore.setState({ session: { status: 'guest' } })
    resolveRefresh(
      new Response(JSON.stringify({ code: 200, message: '성공', data: responseData }), {
        status: 200,
      }),
    )

    await expect(refreshing).rejects.toMatchObject({ status: 401 })
    expect(useAuthStore.getState().session.status).toBe('guest')
    expect(sessionStorage.getItem(refreshTokenKey)).toBeNull()
  })
})
