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

export function getReviews({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<ReviewListResponse> {
  return apiRequest(
    { method: 'GET', path: '/admin/review', accessToken, refreshAccessToken },
    reviewListResponseSchema,
  )
}
