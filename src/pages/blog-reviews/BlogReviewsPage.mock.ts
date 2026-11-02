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

// TODO: API 연동 시 GET /api/auth/current-cardinal의 data.currentCardinal로 교체한다.
export const CURRENT_GENERATION = 33

// BlogReviewRequest.activity enum(Swagger): DOCUMENT_REVIEW, INTERVIEW_REVIEW, COMPANY_PROJECT,
// ACTIVITY_REVIEW, MEETUP_PROJECT
export const ACTIVITY_OPTIONS = [
  { value: 'DOCUMENT_REVIEW', label: '서류 후기' },
  { value: 'INTERVIEW_REVIEW', label: '면접 후기' },
  { value: 'ACTIVITY_REVIEW', label: '활동 후기' },
  { value: 'COMPANY_PROJECT', label: '기업 프로젝트' },
  { value: 'MEETUP_PROJECT', label: '밋업 프로젝트' },
] as const

export const INITIAL_ROWS: BlogReviewRow[] = [
  {
    id: '1',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    activity: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
    link: 'https://kusitms.com',
  },
  {
    id: '2',
    name: '이현진',
    generation: 33,
    part: 'DE',
    activity: '면접 후기',
    title: '큐시즘 34기 면접 합격 후기',
    link: 'https://kusitms.com',
  },
  {
    id: '3',
    name: '이현진',
    generation: 33,
    part: 'FE',
    activity: '활동 후기',
    title: '프론트엔드 파트 활동 후기',
    link: 'https://kusitms.com',
  },
]
