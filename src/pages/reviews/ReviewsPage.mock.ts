import type { PartBadgeType } from '@components/common/PartBadge'

export interface ReviewRow {
  id: string
  name: string
  generation: number
  team: string
  part?: PartBadgeType
  title: string
}
