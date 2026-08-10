import type { SegmentedControlItem } from '@components/common/SegmentedControl'

// 기수 선택 소스가 생기기 전까지 현재 활동 기수를 고정값으로 둔다.
export const CURRENT_GENERATION = 33

export const COHORT_OPTIONS: SegmentedControlItem[] = [
  { value: '33', label: '33기' },
  { value: '32', label: '32기' },
  { value: '31', label: '31기' },
  { value: '30', label: '30기' },
]

export const PLACEHOLDER_THUMBNAIL_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='282' height='150' viewBox='0 0 282 150'%3E%3Crect width='282' height='150' fill='%23F1F2F4'/%3E%3C/svg%3E"

export interface CompanyProjectCard {
  id: string
  cardinal: number
  serviceName: string
  imageUrl: string
}

export const INITIAL_COMPANY_PROJECTS: CompanyProjectCard[] = [
  { id: '1', cardinal: 33, serviceName: '큐시즘 파트너스', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '2', cardinal: 33, serviceName: '테크브릿지', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '3', cardinal: 33, serviceName: '넥스트웨이브', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '4', cardinal: 33, serviceName: '핀포인트', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '5', cardinal: 32, serviceName: '그로우업', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '6', cardinal: 32, serviceName: '오르빗랩', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '7', cardinal: 31, serviceName: '브릿지웍스', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
  { id: '8', cardinal: 30, serviceName: '데일리테크', imageUrl: PLACEHOLDER_THUMBNAIL_URL },
]
