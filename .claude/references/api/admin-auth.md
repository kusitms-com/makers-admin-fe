# 어드민 인증 API Reference

관리자 로그인, 토큰, 세션, 권한 확인 endpoint 작업에는 이 파일을 사용합니다.

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

## 확인 결과: 별도 관리자 전용 로그인 endpoint는 없다

`/admin/*` 아래에 인증 endpoint가 없다. 로그인은 일반 사용자와 공유하는 `/api/auth/*`를 쓰고, 응답의 `authority` 값으로 관리자 여부를 구분한다. `role`은 학회원 구분이며 관리자 권한이 아니다.

## Endpoints

| Method | Path | Operation | 비고 |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signin` | 로그인 | `SignInRequest` → `BaseResponseSignInResponse` |
| `POST` | `/api/auth/signup` | 회원가입 | 관리자 계정 생성 흐름과는 무관할 가능성이 높음(확인 필요) |
| `POST` | `/api/auth/refresh` | 토큰 갱신 | `{ "refreshToken": string }` → `BaseResponseSignInResponse` |
| `POST` | `/api/auth/logout` | 로그아웃 | Bearer access token 필요, 요청 본문 없음 → `BaseResponseObject` |
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
| `role` | `'YB' \| 'OB' \| 'ADMIN'` | 학회원 구분. 레거시 `ADMIN`은 권한 판정에 사용하지 않음 |
| `authority` | `'MEMBER' \| 'MANAGER' \| 'OWNER'` | 관리자 화면에는 `MANAGER`와 `OWNER`만 접근 |
| `redirectPath` | `string` | 일반 사이트 이동 경로. 관리자 앱에서는 `/introduction` 사용 |

## 구현 메모

- 로그인/갱신은 공개 API이고 로그아웃 및 관리자 API는 Bearer JWT 인증이 필요하다. `src/api/client.ts`에서 보호된 요청에 `Authorization: Bearer <accessToken>`을 붙인다.
- 토큰은 응답 본문으로 내려온다. 세션 구현 시 액세스 토큰은 메모리에, 새로고침 후 복원용 리프레시 토큰은 `sessionStorage`에 보관한다.
- 세션 구현 시 로그인과 갱신 응답의 `authority`가 `MANAGER` 또는 `OWNER`인 경우에만 관리자 세션을 유지한다. `MEMBER`이거나 값이 누락되면 토큰을 보관하지 않는다.
- 보호된 요청은 `apiRequest`에 `refreshAccessToken`을 전달하면 401에서 새 액세스 토큰으로 한 번만 재시도한다. 권한 부족(403)은 갱신하지 않는다. 현재 보호된 요청인 로그아웃은 로컬 세션을 먼저 지우고, 401이면 저장된 리프레시 토큰으로 갱신해 다시 요청한다.
- 인증 API 함수는 `src/api/auth.ts`에 둔다.
- 인증 API의 요청·응답과 권한 규칙은 백엔드 `docs/admin-authorization.md`와 배포된 `/api-docs/json`에서 확인했다.
