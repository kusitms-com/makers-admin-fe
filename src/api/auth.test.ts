import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { refreshSession, signIn, signOut } from './auth'
import { apiRequest, type ApiError } from './client'

const signInData = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  role: 'YB',
  authority: 'MANAGER',
  redirectPath: '/mypage',
}

function mockResponse(data: unknown, status = 200, code = 200) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify({ code, message: '요청 결과', data }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test')
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
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.test/api/auth/signin'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: 'admin', password: 'password' }),
      }),
    )
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('Content-Type')).toBe(
      'application/json',
    )
  })

  it('리프레시 토큰으로 새 토큰과 권한을 받아온다', async () => {
    const fetchMock = mockResponse({ ...signInData, authority: 'OWNER' })

    const result = await refreshSession('old-refresh-token')

    expect(result.authority).toBe('OWNER')
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.test/api/auth/refresh'),
      expect.objectContaining({
        body: JSON.stringify({ refreshToken: 'old-refresh-token' }),
      }),
    )
  })

  it('로그아웃 요청에 액세스 토큰을 Bearer 헤더로 보낸다', async () => {
    const fetchMock = mockResponse(null)

    await signOut('access-token')

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.test/api/auth/logout'),
      expect.objectContaining({ method: 'POST', body: undefined }),
    )
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
  })

  it('서버가 data 키를 생략한 성공 응답도 정상 처리한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ code: 200, message: '요청이 성공했습니다.' }), {
          status: 200,
        }),
      ),
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
})

describe('공통 API 요청', () => {
  it('GET 요청에 쿼리 경로와 취소 신호를 전달한다', async () => {
    const fetchMock = mockResponse({ id: 'member-1' })
    const controller = new AbortController()

    const result = await apiRequest(
      { method: 'GET', path: '/admin/members?status=PENDING', signal: controller.signal },
      z.object({ id: z.string() }),
    )

    expect(result.id).toBe('member-1')
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.test/admin/members?status=PENDING'),
      expect.objectContaining({
        method: 'GET',
        body: undefined,
        signal: controller.signal,
      }),
    )
  })

  it('FormData 전송 시 브라우저가 multipart 경계를 설정하도록 Content-Type을 비운다', async () => {
    const fetchMock = mockResponse(null)
    const body = new FormData()
    body.append('image', new Blob(['image'], { type: 'image/png' }), 'image.png')

    await apiRequest({ method: 'POST', path: '/admin/images', body }, z.null())

    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(body)
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).has('Content-Type')).toBe(false)
  })

  it('JSON이 아닌 서버 오류를 HTTP 상태가 있는 ApiError로 전달한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response('Bad Gateway', { status: 502 })),
    )

    await expect(
      apiRequest({ method: 'GET', path: '/admin/members' }, z.unknown()),
    ).rejects.toMatchObject({ name: 'ApiError', status: 502, code: undefined })
  })

  it('응답 code가 401이면 새 액세스 토큰으로 보호 요청을 한 번 재시도한다', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 401, message: '만료', data: null }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 200, message: '성공', data: { id: 'member-1' } }), {
          status: 200,
        }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')

    const result = await apiRequest(
      {
        method: 'GET',
        path: '/admin/members',
        accessToken: 'expired-access',
        refreshAccessToken,
      },
      z.object({ id: z.string() }),
    )

    expect(result.id).toBe('member-1')
    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('Authorization')).toBe(
      'Bearer new-access',
    )
  })

  it('보호 요청이 403이면 토큰을 갱신하지 않는다', async () => {
    const fetchMock = mockResponse(null, 403, 403)
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')

    await expect(
      apiRequest(
        {
          method: 'GET',
          path: '/admin/members',
          accessToken: 'access',
          refreshAccessToken,
        },
        z.unknown(),
      ),
    ).rejects.toMatchObject({ status: 403 })

    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('새 액세스 토큰으로 재시도한 요청도 401이면 더는 갱신하지 않는다', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ code: 401, message: '만료', data: null }), { status: 401 }),
        ),
      )
    vi.stubGlobal('fetch', fetchMock)
    const refreshAccessToken = vi.fn().mockResolvedValue('new-access')

    await expect(
      apiRequest(
        {
          method: 'GET',
          path: '/admin/members',
          accessToken: 'expired-access',
          refreshAccessToken,
        },
        z.unknown(),
      ),
    ).rejects.toMatchObject({ status: 401 })

    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
