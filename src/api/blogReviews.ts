import { z } from 'zod'
import { apiRequest } from './client'

interface RequestContext {
  accessToken: string
  refreshAccessToken?: () => Promise<string>
}

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

function buildBlogReviewFormData(request: BlogReviewCreateRequest): FormData {
  const formData = new FormData()

  formData.append('cardinal', String(request.cardinal))
  formData.append('part', request.part)
  formData.append('activity', request.activity)
  formData.append('title', request.title)
  formData.append('previewText', request.previewText)
  formData.append('blogLink', request.blogLink)
  if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile)

  return formData
}

export function addBlogReview(
  request: BlogReviewCreateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'POST',
      path: '/admin/blog-review',
      body: buildBlogReviewFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}
