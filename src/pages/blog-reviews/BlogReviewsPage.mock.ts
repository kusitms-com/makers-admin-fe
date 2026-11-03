import type { PartBadgeType } from '@components/common/PartBadge'

export interface BlogReviewRow {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  activity: string
  title: string
  link: string
  thumbnailUrl?: string
}

// BlogReviewRequest.activity enum(Swagger): DOCUMENT_REVIEW, INTERVIEW_REVIEW, COMPANY_PROJECT,
// ACTIVITY_REVIEW, MEETUP_PROJECT
export const ACTIVITY_OPTIONS = [
  { value: 'DOCUMENT_REVIEW', label: '서류 후기' },
  { value: 'INTERVIEW_REVIEW', label: '면접 후기' },
  { value: 'ACTIVITY_REVIEW', label: '활동 후기' },
  { value: 'COMPANY_PROJECT', label: '기업 프로젝트' },
  { value: 'MEETUP_PROJECT', label: '밋업 프로젝트' },
] as const
