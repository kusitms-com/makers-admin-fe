// team은 백엔드가 표시용 이름으로 바꿔 내려준다. 기획/디자인/개발 외 팀(BACKEND 등)으로 저장된 데이터는 null이다.
export interface ReviewListItem {
  review_id: number
  name: string
  cardinal: number
  team: '기획팀' | '디자인팀' | '개발팀' | null
  review: string
}

export interface ReviewListResponse {
  review_count: number
  review_list: ReviewListItem[]
}

// ReviewRequest.team enum(Swagger): BACKEND, FRONTEND, IOS, ANDROID, DESIGNER, PLANNER, DEVELOPER
// 관리자 폼은 기획/디자인/개발 3파트만 받으므로 FE/BE/iOS/AOS를 구분하지 않고 DEVELOPER로 통일한다.
export type ReviewTeam = 'PLANNER' | 'DESIGNER' | 'DEVELOPER'

export interface ReviewCreateRequest {
  name: string
  cardinal: number
  team: ReviewTeam
  review: string
}

export interface ReviewUpdateRequest {
  reviewId: number
  name: string
  cardinal: number
  team: ReviewTeam
  review: string
}
