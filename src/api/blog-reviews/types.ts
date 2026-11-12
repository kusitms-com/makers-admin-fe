// BlogReviewRequest.part enum(Swagger): BACKEND, FRONTEND, IOS, ANDROID, DESIGNER, PLANNER, DEVELOPER
// 관리자 폼은 기획/디자인/프론트엔드/백엔드 4파트만 다룬다.
export type BlogReviewPart = 'PLANNER' | 'DESIGNER' | 'FRONTEND' | 'BACKEND'

export type BlogReviewActivity =
  | 'DOCUMENT_REVIEW'
  | 'INTERVIEW_REVIEW'
  | 'COMPANY_PROJECT'
  | 'ACTIVITY_REVIEW'
  | 'MEETUP_PROJECT'

export interface BlogReviewCreateRequest {
  cardinal: number
  part: BlogReviewPart
  activity: BlogReviewActivity
  title: string
  previewText: string
  blogLink: string
  thumbnailFile?: File
}

export interface BlogReviewUpdateRequest extends BlogReviewCreateRequest {
  blogReviewId: number
}

// part는 Team enum 이름 전체(관리자 폼이 다루지 않는 값 포함), activity는 BlogReviewActivity다.
// 썸네일이 없으면 thumbnailUrl 키가 빠지는 게 아니라 null이 온다.
export interface BlogReviewListItem {
  blog_review_id: number
  cardinal: number
  part: string
  activity: string
  title: string
  previewText: string
  blogLink: string
  thumbnailUrl: string | null
}

export interface BlogReviewListResponse {
  blog_review_count: number
  blog_review_list: BlogReviewListItem[]
}
