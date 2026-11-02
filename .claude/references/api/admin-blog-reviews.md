# 어드민 블로그 후기 API Reference

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

블로그 후기 CRUD에는 이 파일을 사용합니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/blog-review` | `getBlogReviews` | 없음 | `BaseResponseObject` |
| `POST` | `/admin/blog-review` | `addBlogReview` | `BlogReviewRequest` multipart | `BaseResponseObject` |
| `PUT` | `/admin/blog-review` | `updateBlogReview` | `BlogReviewRequest` multipart | `BaseResponseObject` |
| `DELETE` | `/admin/blog-review/{id}` | `deleteBlogReview` | path: `id` | `BaseResponseObject` |

## 구현 메모

- API 함수는 `src/api/blogReviews.ts`에 둡니다.
- query key는 `['admin', 'blog-reviews']`를 우선합니다.
- 등록/수정은 `multipart/form-data`입니다.
- 등록/수정/삭제 이후 list query를 invalidate합니다.

## Request Fields

### `BlogReviewRequest`

| Field | Type |
| --- | --- |
| `blogReviewId` | `number` |
| `cardinal` | `number` |
| `part` | `string` (enum: `BACKEND`, `FRONTEND`, `IOS`, `ANDROID`, `DESIGNER`, `PLANNER`, `DEVELOPER`) |
| `activity` | `string` (enum: `DOCUMENT_REVIEW`, `INTERVIEW_REVIEW`, `COMPANY_PROJECT`, `ACTIVITY_REVIEW`, `MEETUP_PROJECT`) |
| `thumbnailFile` | `File` |
| `blogLink` | `string` (블로그 원문 링크) |
| `title` | `string` |
| `previewText` | `string` |

## Response Fields

### `getBlogReviews` data

| Field | Type |
| --- | --- |
| `blog_review_count` | `number` |
| `blog_review_list` | `BlogReviewListItem[]` |

### `BlogReviewListItem`

| Field | Type |
| --- | --- |
| `blog_review_id` | `number` |
| `cardinal` | `number` |
| `part` | `string` (enum: `BACKEND`, `FRONTEND`, `IOS`, `ANDROID`, `DESIGNER`, `PLANNER`, `DEVELOPER`) |
| `activity` | `string` (enum: `DOCUMENT_REVIEW`, `INTERVIEW_REVIEW`, `COMPANY_PROJECT`, `ACTIVITY_REVIEW`, `MEETUP_PROJECT`) |
| `title` | `string` |
| `previewText` | `string` |
| `blogLink` | `string` |
| `thumbnailUrl` | `string` |

작성자 이름 필드는 내려오지 않는다 (관리자 페이지 리스트에는 '관리자'로 고정 표시).
