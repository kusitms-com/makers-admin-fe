# 어드민 인증 API Reference

관리자 로그인, 토큰, 세션, 권한 확인 endpoint 작업에는 이 파일을 사용합니다.

Swagger 출처: `https://kusitms.herokuapp.com/api-docs/json`

## 확인 결과: 별도 관리자 전용 로그인 endpoint는 없다

`/admin/*` 아래에 인증 endpoint가 없다. 로그인은 일반 사용자와 공유하는 `/api/auth/*`를 쓰고, 응답의 `role` 값으로 관리자 여부를 구분한다.

## Endpoints

| Method | Path | Operation | 비고 |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signin` | 로그인 | `SignInRequest` → `BaseResponseSignInResponse` |
| `POST` | `/api/auth/signup` | 회원가입 | 관리자 계정 생성 흐름과는 무관할 가능성이 높음(확인 필요) |
| `POST` | `/api/auth/refresh` | 토큰 갱신 | request/response 상세는 구현 시 재확인 |
| `POST` | `/api/auth/logout` | 로그아웃 | request/response 상세는 구현 시 재확인 |
| `GET` | `/api/auth/current-cardinal` | 현재 기수 조회 | |
| `GET` | `/api/auth/check-id` | 아이디 중복 체크 | |

## `SignInRequest`

| Field | Type |
| --- | --- |
| `id` | `string` |
| `password` | `string` |

## `SignInResponse` (`BaseResponseSignInResponse.data`)

| Field | Type | 비고 |
| --- | --- | --- |
| `accessToken` | `string` | response body로 내려옴 (헤더/쿠키 아님) |
| `refreshToken` | `string` | response body로 내려옴 |
| `role` | `'YB' \| 'OB' \| 'ADMIN'` | `isAdmin` 별도 필드 없음, 이 값으로 관리자 여부 판별 |
| `redirectPath` | `string` | 로그인 후 이동 경로 힌트 |

## 구현 메모

- API 전체가 Bearer JWT 인증이라, `src/api/client.ts`가 `accessToken`을 `Authorization: Bearer <token>` 헤더로 매 요청에 붙여야 한다.
- 토큰이 쿠키가 아니라 응답 본문으로 오므로, 클라이언트가 직접 저장(예: localStorage, 메모리)하고 요청마다 첨부하는 방식을 구현해야 한다 — 저장 위치는 구현 시 결정하고 이 문서에 기록한다.
- 로그인 성공 후 `role !== 'ADMIN'`이면 관리자 화면 접근을 막아야 한다(구체적인 처리 방식은 구현 시 결정).
- `refresh`/`logout`의 정확한 request/response 스키마는 이 문서에 아직 없다 — 실제 구현 시점에 Swagger를 다시 확인하고 채운다.
- 인증 API 함수는 `src/api/auth.ts`에 둔다.
- 서버 상태는 필요한 경우 TanStack Query로 관리한다.
