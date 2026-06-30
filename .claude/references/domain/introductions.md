# 학회 소개 관리 도메인

학회 소개 페이지의 관리자 조회/수정 화면에는 이 reference를 사용합니다.

## 사용하는 API Reference

- `.claude/references/api/admin-introductions.md`

## 주요 화면

- 학회 소개 현재 데이터 조회
- 학회 소개 수정 form

## 주요 위치

```text
src/pages/introductions/
  # 학회 소개 관리 화면 구현 시 생성

src/api/introductions.ts
src/hooks/useIntroductions.ts
```

## 주요 액션

- 학회 소개 조회
- 학회 소개 수정

## 구현 규칙

- request body는 `IntroRequest` multipart schema를 기준으로 합니다.
- 배너, 파트너 로고, 활동 이미지 등 파일/URL 필드는 Swagger schema를 확인한 뒤 타입을 확정합니다.
- 수정 이후 소개 조회 query를 invalidate합니다.
