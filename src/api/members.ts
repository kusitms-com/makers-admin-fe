import { z } from 'zod'
import { apiRequest } from './client'

interface RequestContext {
  accessToken: string
  refreshAccessToken?: () => Promise<string>
}

// AdminMemberResponse(Swagger): admin 계정처럼 가입 절차를 거치지 않은 회원은
// name/phone/email/cardinal/part/status/createdAt이 전부 null로 내려온다.
const adminMemberResponseSchema = z.object({
  userId: z.number(),
  id: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  cardinal: z.number().nullable(),
  part: z.enum(['PLANNER', 'DESIGNER', 'FRONTEND', 'BACKEND']).nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'WITHDRAWN']).nullable(),
  role: z.enum(['YB', 'OB', 'ADMIN']),
  authority: z.enum(['MEMBER', 'MANAGER', 'OWNER']),
  createdAt: z.string().nullable(),
})

const adminMemberListResponseSchema = z.array(adminMemberResponseSchema)

export type AdminMemberResponse = z.infer<typeof adminMemberResponseSchema>

export function getMembers({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<AdminMemberResponse[]> {
  return apiRequest(
    { method: 'GET', path: '/admin/members', accessToken, refreshAccessToken },
    adminMemberListResponseSchema,
  )
}

const pendingMemberResponseSchema = z.object({
  userId: z.number(),
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  cardinal: z.number(),
  part: z.enum(['PLANNER', 'DESIGNER', 'FRONTEND', 'BACKEND']),
  profileImageUrl: z.string(),
  certificateImageUrl: z.string(),
})

const pendingMemberListResponseSchema = z.array(pendingMemberResponseSchema)

export type PendingMemberResponse = z.infer<typeof pendingMemberResponseSchema>

export function getPendingMembers({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<PendingMemberResponse[]> {
  return apiRequest(
    { method: 'GET', path: '/admin/members/pending', accessToken, refreshAccessToken },
    pendingMemberListResponseSchema,
  )
}

export function approveMember(
  userId: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'POST',
      path: `/admin/members/${String(userId)}/approve`,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export function rejectMember(
  userId: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'POST',
      path: `/admin/members/${String(userId)}/reject`,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}
