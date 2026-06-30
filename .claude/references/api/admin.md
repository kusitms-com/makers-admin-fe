# 어드민 API Reference

Swagger 출처: `https://kusitms.herokuapp.com/swagger-ui/index.html#`

이 파일은 어드민 API 작업의 인덱스입니다. 엔드포인트별 상세 내용은 `.claude/references/api` 아래의 `admin-*` 파일에 기록합니다.

## 규칙

- 구현 전에 Swagger에서 endpoint path, method, request body, response shape를 확인합니다.
- Swagger 전체를 일반 사용자 API로 해석하지 않고, 관리자 화면에 필요한 admin endpoint만 사용합니다.
- 새 엔드포인트를 사용하면 관련 reference 파일을 업데이트합니다.
- UI 가정만으로 필드를 만들지 않습니다.
- API 함수는 `src/api`에 둡니다.
- 서버 상태는 TanStack Query hook으로 다룹니다.
- admin endpoint가 없거나 권한/응답 계약이 불명확하면 구현하지 말고 API gap으로 보고합니다.

## 상세 reference

| 영역 | 파일 |
| --- | --- |
| 인증 | `.claude/references/api/admin-auth.md` |
| 멤버 승인 | `.claude/references/api/admin-members.md` |
| 프로젝트 | `.claude/references/api/admin-projects.md` |
| 학회원 후기 | `.claude/references/api/admin-reviews.md` |
| 블로그 후기 | `.claude/references/api/admin-blog-reviews.md` |
| 학회 소개 | `.claude/references/api/admin-introductions.md` |

## 권장 클라이언트 구조

API client를 도입할 때는 아래 분리를 우선합니다.

```text
src/api/
  client.ts          base URL, auth header, 공통 response 처리
  auth.ts            어드민 인증 endpoint
  members.ts         어드민 멤버 승인 endpoint
  projects.ts        어드민 프로젝트 endpoint
  reviews.ts         어드민 학회원 후기 endpoint
  blogReviews.ts     어드민 블로그 후기 endpoint
  introductions.ts   어드민 학회 소개 endpoint
```

## 확인 필요 항목

- base URL과 auth 전략은 Swagger와 런타임 환경을 확인해야 합니다.
- 공통 response envelope은 실제 endpoint 확인 후 문서화합니다.
- 공통 error handling을 만들기 전에 error response shape를 문서화합니다.
