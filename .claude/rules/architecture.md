# 아키텍처 규칙

## 프로젝트 형태

`kusitms-admin`은 React 19 + Vite 8 기반 관리자 SPA입니다. 앱 규모가 커져 더 강한 계층화가 필요해지기 전까지는 단순한 구조를 유지합니다.

## 파일 배치

- API 클라이언트와 요청 함수는 `src/api`에 둡니다.
- 재사용 UI 컴포넌트는 `src/components`에 둡니다.
- 커스텀 훅은 `src/hooks`에 둡니다.
- 페이지 단위 컴포넌트는 `src/pages`에 둡니다.
- 공통 유틸리티는 `src/lib`에 둡니다.
- 공통 타입은 `src/types.ts`에 둘 수 있고, 특정 도메인에만 쓰이면 해당 도메인 파일 근처에 둡니다.
- E2E 테스트는 `e2e`에 둡니다.

## 도메인 폴더 생성 기준

- `src/api`, `src/hooks`, `src/pages`, `src/components`는 루트 위치로 유지합니다.
- `src/pages/{domain}` 같은 도메인 폴더는 해당 기능 구현을 시작할 때 생성합니다.
- 빈 도메인 폴더를 미리 만들지 않습니다.
- 도메인별 예상 위치는 `.claude/references/domain/{domain}.md`의 `주요 위치`를 기준으로 합니다.
- 구현 중 실제 구조가 달라지면 code와 domain reference를 함께 업데이트합니다.

## Import 규칙

가독성이 좋아지는 경우 설정된 alias를 사용합니다.

- `@` -> `src`
- `@api` -> `src/api`
- `@components` -> `src/components`
- `@hooks` -> `src/hooks`
- `@pages` -> `src/pages`

같은 폴더 안의 파일은 상대 import를 우선합니다.

## 경계

- 페이지는 컴포넌트, 훅, API 함수를 조합할 수 있습니다.
- 컴포넌트가 엔드포인트 경로를 직접 알게 하지 않습니다.
- API 함수는 React 컴포넌트를 import하지 않습니다.
- 훅은 API 함수를 TanStack Query로 감쌀 수 있습니다.
- 도메인 모델이 명확해지기 전에는 도메인 간 결합을 피합니다.

## 도메인 구조

```text
src/pages/
└── MembersPage.tsx

src/components/
├── common/
└── members/

src/hooks/
├── common/
└── members/

src/api/
└── members.ts
```

- `src/pages`는 라우트 진입점과 페이지 조립 책임을 우선합니다.
- 공용 UI는 `src/components/common`에 둡니다.
- 특정 도메인 UI는 `src/components/{domain}`에 둡니다.
- 공용 hook은 `src/hooks/common`에 둡니다.
- 특정 도메인 hook은 `src/hooks/{domain}`에 둡니다.
- `src/pages/{domain}/hooks`, `model`, `ui`처럼 FSD식 page-local 세그먼트는 기본으로 만들지 않습니다.
- 도메인 폴더는 실제 파일이 생길 때 만들고, 빈 도메인 폴더를 미리 만들지 않습니다.
