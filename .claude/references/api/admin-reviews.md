# 어드민 학회원 후기 API Reference

Swagger 출처: `https://kusitms.herokuapp.com/api-docs/json`

학회원 후기 CRUD에는 이 파일을 사용합니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/review` | `getReviews_1` | 없음 | `BaseResponseObject` |
| `POST` | `/admin/review` | `addReview` | `ReviewRequest` JSON | `BaseResponseObject` |
| `PUT` | `/admin/review` | `updateReview` | `ReviewRequest` JSON | `BaseResponseObject` |
| `DELETE` | `/admin/review/{id}` | `deleteReview` | path: `id` | `BaseResponseObject` |

## 구현 메모

- API 함수는 `src/api/reviews.ts`에 둡니다.
- query key는 `['admin', 'reviews']`를 우선합니다.
- 수정 API가 path id를 받지 않고 body의 `reviewId`를 사용합니다.
- 삭제 이후 list query를 invalidate합니다.

## Request Fields

### `ReviewRequest`

| Field | Type |
| --- | --- |
| `reviewId` | `number` |
| `name` | `string` |
| `cardinal` | `number` |
| `team` | `string` |
| `review` | `string` |
