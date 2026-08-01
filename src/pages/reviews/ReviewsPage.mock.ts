import type { PartBadgeType } from '@components/common/PartBadge'

export interface ReviewRow {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  category: string
  title: string
}

// TODO: API 연동 시 GET /api/auth/current-cardinal의 data.currentCardinal로 교체한다.
export const CURRENT_GENERATION = 33
// '활동' 컬럼은 ReviewRequest 스키마에 없는 필드라 API 연동 전까지 고정값으로 둔다.
export const CATEGORY_LABEL = '서류 후기'

export const INITIAL_ROWS: ReviewRow[] = [
  {
    id: '1',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    category: CATEGORY_LABEL,
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '2',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    category: CATEGORY_LABEL,
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '3',
    name: '이현진',
    generation: 33,
    part: 'DE',
    category: CATEGORY_LABEL,
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '4',
    name: '이현진',
    generation: 33,
    part: 'FE',
    category: CATEGORY_LABEL,
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '5',
    name: '이현진',
    generation: 33,
    part: 'BE',
    category: CATEGORY_LABEL,
    title: '큐시즘 34기 서류 합격 후기',
  },
]
