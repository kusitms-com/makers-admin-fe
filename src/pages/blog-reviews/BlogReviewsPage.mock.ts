import type { PartBadgeType } from '@components/common/PartBadge'

export interface BlogReviewRow {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  activity: string
  title: string
  link: string
}

// TODO: API 연동 시 GET /api/auth/current-cardinal의 data.currentCardinal로 교체한다.
export const CURRENT_GENERATION = 33

export const ACTIVITY_OPTIONS = [
  { value: 'DOCUMENT', label: '서류 후기' },
  { value: 'INTERVIEW', label: '면접 후기' },
  { value: 'ACTIVITY', label: '활동 후기' },
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
