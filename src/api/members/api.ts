import { apiRequest, apiRequestVoid } from '../client'
import type { AdminMemberStatus, AdminMemberResponse, PendingMemberResponse } from './types'

export async function getMembers(status?: AdminMemberStatus): Promise<AdminMemberResponse[]> {
  // 0건이면 서버가 data 키를 생략한다(client.ts 참고).
  const data = await apiRequest<AdminMemberResponse[] | undefined>({
    method: 'GET',
    path: status ? `/admin/members?status=${status}` : '/admin/members',
  })
  return data ?? []
}

export async function getPendingMembers(): Promise<PendingMemberResponse[]> {
  const data = await apiRequest<PendingMemberResponse[] | undefined>({
    method: 'GET',
    path: '/admin/members/pending',
  })
  return data ?? []
}

export function approveMember(userId: number): Promise<void> {
  return apiRequestVoid({ method: 'POST', path: `/admin/members/${String(userId)}/approve` })
}

export function rejectMember(userId: number): Promise<void> {
  return apiRequestVoid({ method: 'POST', path: `/admin/members/${String(userId)}/reject` })
}
