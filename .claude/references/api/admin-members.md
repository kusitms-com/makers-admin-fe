# 어드민 멤버 API Reference

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

관리자 회원 승인 대기 목록과 승인/반려 action에는 이 파일을 사용합니다.

## Endpoints

| Method | Path | Operation ID | 용도 |
| --- | --- | --- | --- |
| `GET` | `/admin/members` | `getMembers` | 전체 회원 목록 조회 (가입일 최신순) |
| `GET` | `/admin/members/pending` | `getPendingMembers` | 승인 대기 회원 목록 조회 |
| `POST` | `/admin/members/{userId}/approve` | `approveMember` | 승인 대기 회원 가입 승인 |
| `POST` | `/admin/members/{userId}/reject` | `rejectMember` | 승인 대기 회원 가입 반려 및 계정 삭제 |

## Response

### `GET /admin/members`

- response schema: `BaseResponseListAdminMemberResponse`
- data item schema: `AdminMemberResponse`
- query parameter: `status`(optional) — `PENDING` / `APPROVED` / `WITHDRAWN` 필터

| Field | Type | 설명 |
| --- | --- | --- |
| `userId` | `number` | 회원 PK |
| `id` | `string` | 로그인 ID |
| `name` | `string \| null` | 이름 |
| `phone` | `string \| null` | 휴대폰 번호 |
| `email` | `string \| null` | 이메일 |
| `cardinal` | `number \| null` | 활동 기수 |
| `part` | `string \| null` | 파트 (`PLANNER`/`DESIGNER`/`FRONTEND`/`BACKEND`) |
| `status` | `string \| null` | 가입 상태 (`PENDING`/`APPROVED`/`WITHDRAWN`) |
| `role` | `string` | 학회원 구분 (`YB`/`OB`/`ADMIN`) |
| `authority` | `string` | 어드민 권한 (`MEMBER`/`MANAGER`/`OWNER`) |
| `createdAt` | `string \| null` | 가입 일시 |

가입 절차를 거치지 않은 계정(최초 admin 계정 등)은 `name`/`phone`/`email`/`cardinal`/`part`/`status`/`createdAt`이 전부 `null`로 내려온다.

### `GET /admin/members/pending`

- response schema: `BaseResponseListPendingMemberResponse`
- data item schema: `PendingMemberResponse`

| Field | Type | 설명 |
| --- | --- | --- |
| `userId` | `number` | 회원 PK |
| `id` | `string` | 로그인 ID |
| `name` | `string` | 이름 |
| `phone` | `string` | 휴대폰 번호 |
| `cardinal` | `number` | 활동 기수 |
| `part` | `string` | 파트 |
| `profileImageUrl` | `string` | 프로필 이미지 URL |
| `certificateImageUrl` | `string` | 수료증 이미지 URL |

### Mutation 공통

- response schema: `BaseResponseObject`
- `userId`는 path parameter입니다.

## 구현 메모

- API 함수는 `src/api/members.ts`에 둡니다.
- 전체 목록 query key는 `['admin', 'members']`, 승인 대기 목록 query key는 `['admin', 'members', 'pending']`을 우선합니다.
- 승인/반려 mutation 이후 `['admin', 'members']`와 `['admin', 'members', 'pending']`을 모두 invalidate합니다.
- destructive action인 반려는 UI에서 확인 절차를 둡니다.
