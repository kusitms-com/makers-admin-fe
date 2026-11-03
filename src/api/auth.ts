import { z } from 'zod'
import { apiRequest } from './client'

const signInResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  authority: z.enum(['MEMBER', 'MANAGER', 'OWNER']),
})

export type SignInResponse = z.infer<typeof signInResponseSchema>

export function signIn(id: string, password: string): Promise<SignInResponse> {
  return apiRequest(
    { method: 'POST', path: '/api/auth/signin', body: { id, password } },
    signInResponseSchema,
  )
}

export function refreshSession(refreshToken: string): Promise<SignInResponse> {
  return apiRequest(
    { method: 'POST', path: '/api/auth/refresh', body: { refreshToken } },
    signInResponseSchema,
  )
}

export function signOut(
  accessToken: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<unknown> {
  return apiRequest(
    { method: 'POST', path: '/api/auth/logout', accessToken, refreshAccessToken },
    z.unknown(),
  )
}

const currentCardinalResponseSchema = z.object({
  currentCardinal: z.number(),
})

export function getCurrentCardinal(): Promise<number> {
  return apiRequest(
    { method: 'GET', path: '/api/auth/current-cardinal' },
    currentCardinalResponseSchema,
  ).then((data) => data.currentCardinal)
}
