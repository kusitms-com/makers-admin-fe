# 어드민 인증 API Reference

관리자 로그인, 토큰, 세션, 권한 확인 endpoint 작업에는 이 파일을 사용합니다.

## 구현 전 확인

- Swagger에서 관리자 인증 endpoint인지 확인합니다.
- 일반 사용자 인증 API를 관리자 인증으로 대체 사용하지 않습니다.
- 관리자 API가 Bearer token, cookie session, 또는 다른 인증 방식을 요구하는지 확인합니다.

## 문서화할 항목

- 관리자 로그인 endpoint path와 method
- request body
- response body
- token refresh 또는 logout endpoint
- error response shape

## 구현 메모

- 인증 API 함수는 `src/api/auth.ts` 또는 admin 인증 도메인 파일에 둡니다.
- 서버 상태는 필요한 경우 TanStack Query로 관리합니다.
- token 저장 방식은 구현 전 명확히 확인합니다.
