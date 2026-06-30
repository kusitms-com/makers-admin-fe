# 데이터 패칭 규칙

## 서버 상태

- 서버 데이터에는 TanStack Query v5를 사용합니다.
- `useState + useEffect`로 서버 데이터를 직접 fetch하지 않습니다.
- query key는 안정적이고 도메인 중심으로 만들며, 훅 또는 API 모듈 근처에 둡니다.
- 생성, 수정, 삭제, 승인, 반려, 상태 변경에는 mutation을 사용합니다.

## API 계층

- raw request 함수는 `src/api`에 둡니다.
- 파일은 `members.ts`, `projects.ts`, `reviews.ts`처럼 도메인 기준으로 이름 짓습니다.
- 추측한 엔드포인트 경로를 하드코딩하지 않습니다. Swagger 또는 `.claude/references/api`로 확인합니다.
- request/response 타입은 현재 UI 요구사항을 표현할 만큼 명시적으로 둡니다.
- API client가 생기면 base URL과 auth 처리를 한곳에 모읍니다.

## 폼

- React Hook Form과 Zod를 함께 사용합니다.
- schema가 재사용되지 않으면 form 근처에 둡니다.
- 가능하면 서버 검증 에러를 field error로 매핑합니다.

## 클라이언트 상태

- Zustand는 UI preference, 선택된 workspace, 로컬 workflow 상태처럼 클라이언트 전용 상태에만 사용합니다.
- TanStack Query 데이터를 Zustand로 복제하지 않습니다.
