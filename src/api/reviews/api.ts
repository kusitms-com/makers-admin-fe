import { apiRequest, apiRequestVoid } from '../client'
import type { ReviewListResponse, ReviewCreateRequest, ReviewUpdateRequest } from './types'

export function getReviews(): Promise<ReviewListResponse> {
  return apiRequest({ method: 'GET', path: '/admin/review' })
}

export function addReview(request: ReviewCreateRequest): Promise<void> {
  return apiRequestVoid({ method: 'POST', path: '/admin/review', body: request })
}

export function updateReview(request: ReviewUpdateRequest): Promise<void> {
  return apiRequestVoid({ method: 'PUT', path: '/admin/review', body: request })
}

export function deleteReview(id: number): Promise<void> {
  return apiRequestVoid({ method: 'DELETE', path: `/admin/review/${String(id)}` })
}
