import { z } from 'zod'
import { apiRequest } from './client'

interface RequestContext {
  accessToken: string
  refreshAccessToken?: () => Promise<string>
}

const reviewListItemSchema = z.object({
  review_id: z.number(),
  name: z.string(),
  cardinal: z.number(),
  team: z.string(),
  review: z.string(),
})

const reviewListResponseSchema = z.object({
  review_count: z.number(),
  review_list: z.array(reviewListItemSchema),
})

export type ReviewListItem = z.infer<typeof reviewListItemSchema>
export type ReviewListResponse = z.infer<typeof reviewListResponseSchema>

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

export function getReviews({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<ReviewListResponse> {
  return apiRequest(
    { method: 'GET', path: '/admin/review', accessToken, refreshAccessToken },
    reviewListResponseSchema,
  )
}

export function addReview(
  request: ReviewCreateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'POST',
      path: '/admin/review',
      body: request,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export function updateReview(
  request: ReviewUpdateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'PUT',
      path: '/admin/review',
      body: request,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export function deleteReview(
  id: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'DELETE',
      path: `/admin/review/${String(id)}`,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}
