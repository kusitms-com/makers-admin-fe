import { z } from 'zod'
import { apiRequest, apiRequestVoid } from '../client'
import type { CurrentCardinalResponse, CurrentCardinalUpdateResponse } from './types'

// 세션을 만드는 값이라 다른 응답과 달리 형태를 검사한다. 토큰이 비어 있으면 깨진 세션으로 진행되기 때문이다.
// role은 화면에서 쓰지 않아 검사하지 않는다(signin은 YB/OB만 반환).
const signInResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  authority: z.enum(['MEMBER', 'MANAGER', 'OWNER']),
})

export type SignInResponse = z.infer<typeof signInResponseSchema>

export async function signIn(id: string, password: string): Promise<SignInResponse> {
  return signInResponseSchema.parse(
    await apiRequest({
      method: 'POST',
      path: '/api/auth/signin',
      body: { id, password },
      skipAuth: true,
    }),
  )
}

export async function refreshSession(refreshToken: string): Promise<SignInResponse> {
  return signInResponseSchema.parse(
    await apiRequest({
      method: 'POST',
      path: '/api/auth/refresh',
      body: { refreshToken },
      skipAuth: true,
    }),
  )
}

// 로그아웃은 store 세션을 먼저 비운 뒤 보내므로 토큰을 직접 넘긴다.
export function signOut(
  accessToken: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<void> {
  return apiRequestVoid({
    method: 'POST',
    path: '/api/auth/logout',
    accessToken,
    refreshAccessToken,
  })
}

export async function getCurrentCardinal(): Promise<number> {
  const data = await apiRequest<CurrentCardinalResponse>({
    method: 'GET',
    path: '/api/auth/current-cardinal',
    skipAuth: true,
  })
  return data.currentCardinal
}

// OWNER 전용. 현재 기수에서 ±1기만 바꿀 수 있고, 바꾸면 전체 회원의 YB/OB를 다시 계산한다.
export function updateCurrentCardinal(cardinal: number): Promise<CurrentCardinalUpdateResponse> {
  return apiRequest({
    method: 'PUT',
    path: '/admin/owner/current-cardinal',
    body: { cardinal },
  })
}
