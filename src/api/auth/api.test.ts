import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentCardinal, refreshSession, signIn, signOut } from './api'
import { apiRequest, setAuthTokenSource, type ApiError } from '../client'
import { getMembers } from '../members/api'

const signInData = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  role: 'YB',
  authority: 'MANAGER',
  redirectPath: '/mypage',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function mockResponse(data: unknown, status = 200, code = 200) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockImplementation(() =>
      Promise.resolve(jsonResponse({ code, message: '요청 결과', data }, status)),
    )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// axios fetch 어댑터는 fetch(Request)로 호출한다.
function sentRequest(fetchMock: ReturnType<typeof mockResponse>, index = 0) {
  const request = fetchMock.mock.calls[index]?.[0]
  if (!(request instanceof Request)) throw new Error('fetch가 Request로 호출되지 않았습니다.')
  return request
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test')
  setAuthTokenSource({ getAccessToken: () => undefined, refreshAccessToken: vi.fn() })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('인증 API', () => {
  it('로그인 요청을 보내고 authority를 포함한 응답을 반환한다', async () => {
    const fetchMock = mockResponse(signInData)

    const result = await signIn('admin', 'password')

    expect(result.authority).toBe('MANAGER')
    const request = sentRequest(fetchMock)
    expect(request.url).toBe('https://api.example.test/api/auth/signin')
    expect(request.method).toBe('POST')
    expect(await request.text()).toBe(JSON.stringify({ id: 'admin', password: 'password' }))
    expect(request.headers.get('Content-Type')).toContain('application/json')
  })

  it('리프레시 토큰으로 새 토큰과 권한을 받아온다', async () => {
    const fetchMock = mockResponse({ ...signInData, authority: 'OWNER' })

    const result = await refreshSession('old-refresh-token')

    expect(result.authority).toBe('OWNER')
    const request = sentRequest(fetchMock)
    expect(request.url).toBe('https://api.example.test/api/auth/refresh')
    expect(await request.text()).toBe(JSON.stringify({ refreshToken: 'old-refresh-token' }))
  })

  it('공개 API에는 등록된 토큰을 붙이지 않는다', async () => {
    setAuthTokenSource({ getAccessToken: () => 'stored-access', refreshAccessToken: vi.fn() })
    const fetchMock = mockResponse(signInData)

    await signIn('admin', 'password')

    expect(sentRequest(fetchMock).headers.has('Authorization')).toBe(false)
  })

  it('로그아웃 요청에 액세스 토큰을 Bearer 헤더로 보낸다', async () => {
    const fetchMock = mockResponse(null)

    await signOut('access-token')

    const request = sentRequest(fetchMock)
    expect(request.url).toBe('https://api.example.test/api/auth/logout')
    expect(request.method).toBe('POST')
    expect(request.headers.get('Authorization')).toBe('Bearer access-token')
  })

  it('서버가 data 키를 생략한 성공 응답도 정상 처리한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(jsonResponse({ code: 200, message: '요청이 성공했습니다.' })),
    )

    await expect(signOut('access-token')).resolves.toBeUndefined()
  })

  it('로그인 실패의 HTTP 401을 전달한다', async () => {
    mockResponse(null, 401, 401)

    await expect(signIn('admin', 'wrong')).rejects.toMatchObject({ status: 401 })
  })

  it('권한 부족의 HTTP 403을 전달한다', async () => {
    mockResponse(null, 403, 403)

    await expect(signOut('invalid-token')).rejects.toMatchObject({ status: 403 })
  })

  it('HTTP 200이라도 본문 code가 실패이면 오류로 처리한다', async () => {
    mockResponse(null, 200, 500)

    await expect(refreshSession('expired')).rejects.toMatchObject({
      name: 'ApiError',
      status: 200,
      code: 500,
    } satisfies Partial<ApiError>)
  })

  it('권한 정보가 빠진 성공 응답은 세션 데이터로 받지 않는다', async () => {
    mockResponse({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      role: 'YB',
      redirectPath: '/mypage',
    })

    await expect(signIn('admin', 'password')).rejects.toThrow()
  })

  it('현재 기수를 조회한다', async () => {
    const fetchMock = mockResponse({ currentCardinal: 34 })

    const result = await getCurrentCardinal()

    expect(result).toBe(34)
    const request = sentRequest(fetchMock)
    expect(request.url).toBe('https://api.example.test/api/auth/current-cardinal')
    expect(request.method).toBe('GET')
  })
})

describe('공통 API 요청', () => {
  it('등록된 토큰을 보호 요청에 자동으로 붙인다', async () => {
    setAuthTokenSource({ getAccessToken: () => 'stored-access', refreshAccessToken: vi.fn() })
    const fetchMock = mockResponse([])

    await getMembers('APPROVED')

    const request = sentRequest(fetchMock)
    expect(request.url).toBe('https://api.example.test/admin/members?status=APPROVED')
    expect(request.headers.get('Authorization')).toBe('Bearer stored-access')
  })

  it('목록이 0건이라 data가 생략되면 빈 배열로 받는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ code: 200, message: '성공' })),
    )

    await expect(getMembers()).resolves.toEqual([])
  })

  it('취소된 요청은 보내지 않고 실패한다', async () => {
    const fetchMock = mockResponse({ id: 'member-1' })
    const controller = new AbortController()
    controller.abort()

    await expect(
      apiRequest({ method: 'GET', path: '/admin/members', signal: controller.signal }),
    ).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('FormData 전송 시 multipart 경계가 붙은 Content-Type으로 보낸다', async () => {
    const fetchMock = mockResponse(null)
    const body = new FormData()
    body.append('name', '큐시즘')

    await apiRequest({ method: 'POST', path: '/admin/images', body })

    const request = sentRequest(fetchMock)
    expect(request.headers.get('Content-Type')).toMatch(/^multipart\/form-data; boundary=/)
    expect(await request.text()).toContain('큐시즘')
  })

  it('JSON이 아닌 서버 오류를 HTTP 상태가 있는 ApiError로 전달한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response('Bad Gateway', { status: 502 })),
    )

    await expect(apiRequest({ method: 'GET', path: '/admin/members' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
      code: undefined,
    })
  })

  it('응답 code가 401이면 새 액세스 토큰으로 보호 요청을 한 번 재시도한다', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ code: 401, message: '만료', data: null }))
      .mockResolvedValueOnce(jsonResponse({ code: 200, message: '성공', data: { id: 'member-1' } }))
    vi.stubGlobal('fetch', fetchMock)
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')

    const result = await apiRequest<{ id: string }>({
      method: 'GET',
      path: '/admin/members',
      accessToken: 'expired-access',
      refreshAccessToken,
    })

    expect(result.id).toBe('member-1')
    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(sentRequest(fetchMock, 1).headers.get('Authorization')).toBe('Bearer new-access')
  })

  it('등록된 토큰이 만료되면 등록된 갱신 함수로 재시도한다', async () => {
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')
    setAuthTokenSource({ getAccessToken: () => 'expired-access', refreshAccessToken })
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ code: 401, message: '만료' }, 401))
      .mockResolvedValueOnce(jsonResponse({ code: 200, message: '성공', data: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getMembers()).resolves.toEqual([])
    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(sentRequest(fetchMock, 1).headers.get('Authorization')).toBe('Bearer new-access')
  })

  it('보호 요청이 403이면 토큰을 갱신하지 않는다', async () => {
    const fetchMock = mockResponse(null, 403, 403)
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')

    await expect(
      apiRequest({
        method: 'GET',
        path: '/admin/members',
        accessToken: 'access',
        refreshAccessToken,
      }),
    ).rejects.toMatchObject({ status: 403 })

    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('새 액세스 토큰으로 재시도한 요청도 401이면 더는 갱신하지 않는다', async () => {
    const fetchMock = mockResponse(null, 401, 401)
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')

    await expect(
      apiRequest({
        method: 'GET',
        path: '/admin/members',
        accessToken: 'expired-access',
        refreshAccessToken,
      }),
    ).rejects.toMatchObject({ status: 401 })

    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
