# 멤버 승인 도메인

승인 대기 회원 조회와 승인/반려 화면에는 이 reference를 사용합니다.

## 사용하는 API Reference

- `.claude/references/api/admin-members.md`

## 주요 화면

- 승인 대기 회원 목록
- 수료증/프로필 이미지 확인
- 가입 승인/반려 action

## 주요 위치

```text
src/pages/members/
  # 멤버 승인 화면 구현 시 생성

src/api/members.ts
src/hooks/useMembers.ts
```

## 주요 액션

- 승인 대기 목록 조회
- 회원 승인
- 회원 반려 및 계정 삭제

## 구현 규칙

- endpoint path, request, response shape는 API reference를 기준으로 합니다.
- 목록 서버 상태는 TanStack Query로 관리합니다.
- 승인/반려 이후 승인 대기 목록 query를 invalidate합니다.
- 반려는 계정 삭제 성격이 있으므로 confirmation을 둡니다.
