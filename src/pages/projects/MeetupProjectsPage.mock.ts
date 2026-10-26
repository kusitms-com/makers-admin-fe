import type { SegmentedControlItem } from '@components/common/SegmentedControl'
import type { SelectFieldOption } from '@components/common/SelectField'

// 기수 선택 소스가 생기기 전까지 현재 활동 기수를 고정값으로 둔다.
export const CURRENT_GENERATION = 33

export const COHORT_OPTIONS: SegmentedControlItem[] = [
  { value: '33', label: '33기' },
  { value: '32', label: '32기' },
  { value: '31', label: '31기' },
  { value: '30', label: '30기' },
]

// 백엔드 ProjectType enum 상수명(WEB/APP)과 정확히 일치해야 한다(Spring 기본 enum 바인딩은 대소문자를 구분한다).
export const TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'WEB', label: 'Web' },
  { value: 'APP', label: 'App' },
]

export const PART_OPTIONS: SelectFieldOption[] = [
  { value: 'planner', label: '기획' },
  { value: 'designer', label: '디자인' },
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'ios', label: 'iOS' },
  { value: 'aos', label: 'AOS' },
]

export const PLACEHOLDER_THUMBNAIL_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='282' height='150' viewBox='0 0 282 150'%3E%3Crect width='282' height='150' fill='%23F1F2F4'/%3E%3C/svg%3E"

export interface MeetupProjectCard {
  id: string
  cardinal: number
  serviceName: string
  imageUrl: string
}
