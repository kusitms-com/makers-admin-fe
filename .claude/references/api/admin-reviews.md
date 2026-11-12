# 어드민 학회원 후기 API Reference

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

학회원 후기 CRUD에는 이 파일을 사용합니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/review` | `getReviews_1` | 없음 | `BaseResponseObject` |
| `POST` | `/admin/review` | `addReview` | `ReviewRequest` JSON | `BaseResponseObject` |
| `PUT` | `/admin/review` | `updateReview` | `ReviewRequest` JSON | `BaseResponseObject` |
| `DELETE` | `/admin/review/{id}` | `deleteReview` | path: `id` | `BaseResponseObject` |

## 구현 메모

- API 함수는 `src/api/reviews/api.ts`에 둡니다.
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

### 응답 (`GET /admin/review`) (백엔드 소스 `kusitms-com/api.kusitms.com` main `289ee1d`로 확인, 2026-11-11)

```json
{
  "review_count": number,
  "review_list": { "review_id": number, "name": string, "cardinal": number, "team": "기획팀" | "디자인팀" | "개발팀" | null, "review": string }[]
}
```

- `team`은 enum 이름이 아니라 표시용 이름으로 내려옵니다. `BACKEND`/`FRONTEND`/`IOS`/`ANDROID`로 저장된 데이터는 `null`입니다(`ReviewDetailResponse`의 switch `default`).
