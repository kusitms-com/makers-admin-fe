import { create } from 'zustand'
import { z } from 'zod'
import { refreshSession, signIn, signOut } from '@api/auth/api'
import { ApiError, isNetworkError, setAuthTokenSource } from '@api/client'

const REFRESH_TOKEN_KEY = 'kusitms-admin-refresh-token'

// 서버가 리프레시 토큰 자체를 거부한 경우(4xx, 응답 형식 오류). 네트워크·5xx 같은 일시 오류와 구분한다.
function isRejectedSessionError(error: unknown) {
  return (
    (error instanceof ApiError && error.status >= 400 && error.status < 500) ||
    error instanceof z.ZodError
  )
}

type AuthSession =
  | { readonly status: 'loading' | 'guest' }
  | {
      readonly status: 'authenticated'
      readonly accessToken: string
      readonly authority: 'MANAGER' | 'OWNER'
    }

interface AuthStore {
  readonly session: AuthSession
  readonly restore: () => Promise<void>
  readonly login: (id: string, password: string) => Promise<void>
  readonly logout: () => Promise<void>
  readonly refreshAccessToken: () => Promise<string>
}

// 같은 세션에서 동시에 401을 받은 요청들은 갱신 하나를 함께 기다린다.
// 따로 갱신하면 먼저 끝난 갱신이 세션을 바꿔, 나머지는 로그아웃으로 오인해 실패한다.
let inFlightRefresh: { readonly session: AuthSession; readonly promise: Promise<string> } | null =
  null

export const useAuthStore = create<AuthStore>((set, get) => {
  // 갱신을 기다리는 사이 로그아웃·재로그인하면 세션 객체가 바뀐다. 그때는 이 갱신 결과를 버린다.
  async function refreshOnce(startedSession: AuthSession): Promise<string> {
    const endSessionIfUnchanged = () => {
      if (get().session !== startedSession) return
      sessionStorage.removeItem(REFRESH_TOKEN_KEY)
      set({ session: { status: 'guest' } })
    }

    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      endSessionIfUnchanged()
      throw new ApiError(401, undefined, '다시 로그인해주세요.')
    }

    let result: Awaited<ReturnType<typeof refreshSession>>
    try {
      result = await refreshSession(refreshToken)
    } catch (error) {
      // 리프레시 토큰이 거부되면 로그인 화면으로 보낸다. 네트워크·5xx 같은 일시 오류는 세션을 유지한다.
      if (isRejectedSessionError(error)) endSessionIfUnchanged()
      throw error
    }

    if (get().session !== startedSession) {
      throw new ApiError(401, undefined, '다시 로그인해주세요.')
    }
    if (result.authority === 'MEMBER') {
      endSessionIfUnchanged()
      throw new ApiError(403, undefined, '관리자 권한이 없는 계정입니다.')
    }
    sessionStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
    set({
      session: {
        status: 'authenticated',
        accessToken: result.accessToken,
        authority: result.authority,
      },
    })
    return result.accessToken
  }

  return {
    session: { status: 'loading' },
    refreshAccessToken: () => {
      const startedSession = get().session
      if (inFlightRefresh?.session === startedSession) return inFlightRefresh.promise
      const promise = refreshOnce(startedSession).finally(() => {
        if (inFlightRefresh?.promise === promise) inFlightRefresh = null
      })
      inFlightRefresh = { session: startedSession, promise }
      return promise
    },
    restore: async () => {
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refreshToken) {
        set({ session: { status: 'guest' } })
        return
      }

      try {
        const result = await refreshSession(refreshToken)
        if (result.authority === 'MEMBER') {
          sessionStorage.removeItem(REFRESH_TOKEN_KEY)
          set({ session: { status: 'guest' } })
          return
        }
        sessionStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
        set({
          session: {
            status: 'authenticated',
            accessToken: result.accessToken,
            authority: result.authority,
          },
        })
      } catch (error) {
        set({ session: { status: 'guest' } })
        // 토큰이 거부된 경우(4xx, 응답 형식 오류)만 지우고, 네트워크·5xx 같은 일시 오류는 다음 복원을 위해 남긴다.
        if (isRejectedSessionError(error)) {
          sessionStorage.removeItem(REFRESH_TOKEN_KEY)
        } else if (!(error instanceof ApiError || isNetworkError(error))) {
          throw error
        }
      }
    },
    login: async (id, password) => {
      const result = await signIn(id, password)
      if (result.authority === 'MEMBER') {
        throw new ApiError(403, undefined, '관리자 권한이 없는 계정입니다.')
      }
      sessionStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
      set({
        session: {
          status: 'authenticated',
          accessToken: result.accessToken,
          authority: result.authority,
        },
      })
    },
    logout: async () => {
      const session = get().session
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_TOKEN_KEY)
      set({ session: { status: 'guest' } })
      if (session.status === 'authenticated') {
        await signOut(
          session.accessToken,
          refreshToken
            ? async () => {
                const result = await refreshSession(refreshToken)
                if (result.authority === 'MEMBER') {
                  throw new ApiError(403, undefined, '관리자 권한이 없는 계정입니다.')
                }
                return result.accessToken
              }
            : undefined,
        )
      }
    },
  }
})

// 로그인 화면 배경처럼 비로그인 상태에서도 관리자 화면이 렌더링되므로, 서버 조회는 로그인 상태일 때만 한다.
export function useIsAuthenticated() {
  return useAuthStore((state) => state.session.status === 'authenticated')
}

// API 클라이언트가 요청마다 현재 토큰을 읽고, 401이면 이 store로 토큰을 갱신한다.
setAuthTokenSource({
  getAccessToken: () => {
    const { session } = useAuthStore.getState()
    return session.status === 'authenticated' ? session.accessToken : undefined
  },
  refreshAccessToken: () => useAuthStore.getState().refreshAccessToken(),
})
