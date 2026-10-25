import { create } from 'zustand'
import { z } from 'zod'
import { refreshSession, signIn, signOut } from '@api/auth'
import { ApiError } from '@api/client'

const REFRESH_TOKEN_KEY = 'kusitms-admin-refresh-token'

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
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: { status: 'loading' },
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
      if (
        (error instanceof ApiError && error.status >= 400 && error.status < 500) ||
        error instanceof z.ZodError
      ) {
        sessionStorage.removeItem(REFRESH_TOKEN_KEY)
      } else if (!(error instanceof ApiError || error instanceof TypeError)) {
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
}))
