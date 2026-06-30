# 블로그 후기 도메인

블로그 후기 관리 화면에는 이 reference를 사용합니다.

## 사용하는 API Reference

- `.claude/references/api/admin-blog-reviews.md`

## 주요 화면

- 블로그 후기 목록
- 블로그 후기 등록/수정 form

## 주요 위치

```text
src/pages/blog-reviews/
  # 블로그 후기 관리 화면 구현 시 생성

src/api/blogReviews.ts
src/hooks/useBlogReviews.ts
```

## 주요 액션

- 블로그 후기 목록 조회
- 블로그 후기 등록
- 블로그 후기 수정
- 블로그 후기 삭제

## 구현 규칙

- request body는 `BlogReviewRequest` multipart schema를 기준으로 합니다.
- 이미지/파일 필드가 있으면 `FormData`로 전송합니다.
- 삭제는 confirmation을 둡니다.
- 등록/수정/삭제 이후 블로그 후기 목록 query를 invalidate합니다.
