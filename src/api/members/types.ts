export type MemberPart = 'PLANNER' | 'DESIGNER' | 'FRONTEND' | 'BACKEND'

export type AdminMemberStatus = 'PENDING' | 'APPROVED' | 'WITHDRAWN'

// AdminMemberResponse: admin 계정처럼 가입 절차를 거치지 않은 회원은
// name/phone/email/cardinal/part/status/createdAt이 전부 null이다. 탈퇴 회원은 role도 null이다(Member.withdraw).
export interface AdminMemberResponse {
  userId: number
  id: string
  name: string | null
  phone: string | null
  email: string | null
  cardinal: number | null
  part: MemberPart | null
  status: AdminMemberStatus | null
  role: 'YB' | 'OB' | 'ADMIN' | null
  authority: 'MEMBER' | 'MANAGER' | 'OWNER'
  createdAt: string | null
}

// certificateImageUrl은 수료증이 필수가 아닌 기수(34기 이후)라면 null이다.
export interface PendingMemberResponse {
  userId: number
  id: string
  name: string
  phone: string
  cardinal: number
  part: MemberPart
  profileImageUrl: string
  certificateImageUrl: string | null
}
