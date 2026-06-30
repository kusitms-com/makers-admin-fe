# 학회원 후기 도메인

학회원 후기 관리 화면에는 이 reference를 사용합니다.

## 사용하는 API Reference

- `.claude/references/api/admin-reviews.md`

## 주요 화면

- 학회원 후기 목록
- 후기 등록/수정 form

## 주요 위치

```text
src/pages/reviews/
  # 학회원 후기 관리 화면 구현 시 생성

src/api/reviews.ts
src/hooks/useReviews.ts
```

## 주요 액션

- 후기 목록 조회
- 후기 등록
- 후기 수정
- 후기 삭제

## 구현 규칙

- request body는 `ReviewRequest` schema를 기준으로 합니다.
- 수정 시 식별자가 body에 포함되는지 API reference와 Swagger schema를 확인합니다.
- 삭제는 confirmation을 둡니다.
- 등록/수정/삭제 이후 후기 목록 query를 invalidate합니다.
