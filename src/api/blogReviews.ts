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

export interface BlogReviewUpdateRequest extends BlogReviewCreateRequest {
  blogReviewId: number
}

const blogReviewListItemSchema = z.object({
  blog_review_id: z.number(),
  cardinal: z.number(),
  part: z.string(),
  activity: z.string(),
  title: z.string(),
  previewText: z.string(),
  blogLink: z.string(),
  thumbnailUrl: z.string().optional(),
})

const blogReviewListResponseSchema = z.object({
  blog_review_count: z.number(),
  blog_review_list: z.array(blogReviewListItemSchema),
})

export type BlogReviewListItem = z.infer<typeof blogReviewListItemSchema>
export type BlogReviewListResponse = z.infer<typeof blogReviewListResponseSchema>

function buildBlogReviewFormData(
  request: BlogReviewCreateRequest | BlogReviewUpdateRequest,
): FormData {
  const formData = new FormData()

  if ('blogReviewId' in request) formData.append('blogReviewId', String(request.blogReviewId))
  formData.append('cardinal', String(request.cardinal))
  formData.append('part', request.part)
  formData.append('activity', request.activity)
  formData.append('title', request.title)
  formData.append('previewText', request.previewText)
  formData.append('blogLink', request.blogLink)
  if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile)

  return formData
}

export function getBlogReviews({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<BlogReviewListResponse> {
  return apiRequest(
    { method: 'GET', path: '/admin/blog-review', accessToken, refreshAccessToken },
    blogReviewListResponseSchema,
  )
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

export function updateBlogReview(
  request: BlogReviewUpdateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'PUT',
      path: '/admin/blog-review',
      body: buildBlogReviewFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export function deleteBlogReview(
  id: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'DELETE',
      path: `/admin/blog-review/${String(id)}`,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}
