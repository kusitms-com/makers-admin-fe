import { apiRequest, apiRequestVoid } from '../client'
import type {
  BlogReviewCreateRequest,
  BlogReviewUpdateRequest,
  BlogReviewListResponse,
} from './types'

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

export function getBlogReviews(): Promise<BlogReviewListResponse> {
  return apiRequest({ method: 'GET', path: '/admin/blog-review' })
}

export function addBlogReview(request: BlogReviewCreateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'POST',
    path: '/admin/blog-review',
    body: buildBlogReviewFormData(request),
  })
}

export function updateBlogReview(request: BlogReviewUpdateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'PUT',
    path: '/admin/blog-review',
    body: buildBlogReviewFormData(request),
  })
}

export function deleteBlogReview(id: number): Promise<void> {
  return apiRequestVoid({ method: 'DELETE', path: `/admin/blog-review/${String(id)}` })
}
