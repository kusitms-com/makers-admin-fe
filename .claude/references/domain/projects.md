# 프로젝트 관리 도메인

밋업데이/기업 프로젝트 관리 화면에는 이 reference를 사용합니다.

## 사용하는 API Reference

- `.claude/references/api/admin-projects.md`

## 주요 화면

- 밋업데이 프로젝트 목록/상세
- 기업 프로젝트 목록/상세
- 프로젝트 등록/수정 form

## 주요 위치

```text
src/pages/projects/
  # 프로젝트 관리 화면 구현 시 생성

src/api/projects.ts
src/hooks/useProjects.ts
```

## 주요 액션

- 프로젝트 목록 조회
- 프로젝트 상세 조회
- 프로젝트 등록
- 프로젝트 수정
- 프로젝트 삭제

## 구현 규칙

- `meetup`과 `corporate`를 같은 화면에서 다룰 때도 query key는 type별로 분리합니다.
- 등록/수정 form은 `multipart/form-data` 전송을 기준으로 설계합니다.
- 이미지 파일과 URL 필드는 Swagger schema를 확인한 뒤 타입을 확정합니다.
- 삭제 이후 관련 목록 query를 invalidate합니다.
