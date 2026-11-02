import type { PartBadgeType } from '@components/common/PartBadge'

export interface ReviewRow {
  id: string
  name: string
  generation: number
  team: string
  part?: PartBadgeType
  title: string
}

// TODO: API 연동 시 GET /api/auth/current-cardinal의 data.currentCardinal로 교체한다.
export const CURRENT_GENERATION = 33
