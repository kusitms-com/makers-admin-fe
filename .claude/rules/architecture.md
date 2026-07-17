# 아키텍처 규칙

## 프로젝트 형태

`kusitms-admin`은 React 19 + Vite 8 기반 관리자 SPA입니다. 라우팅은 React Router Framework Mode(`ssr: false`, `appDirectory: 'src'`)를 사용합니다 — 근거는 `.claude/decisions/records/003-react-router-framework-mode.md`. 앱 규모가 커져 더 강한 계층화가 필요해지기 전까지는 단순한 구조를 유지합니다.

## 파일 배치

| 위치 | 용도 |
| --- | --- |
| `src/api` | API 클라이언트, 요청 함수 |
| `src/components` | 재사용 UI 컴포넌트 (`common` 또는 `{domain}`) |
| `src/hooks` | 커스텀 훅 (`common` 또는 `{domain}`) |
| `src/pages` | 라우트 진입점, 페이지 조립 (`errors/` 같은 cross-cutting pseudo-domain도 이 아래) |
| `src/routes.ts` | 라우트 설정 (`@react-router/dev/routes`) |
| `src/routes/(group)` | 접근 그룹별 라우트 진입 파일 (`(auth)`, `(main)`) — 아래 설명 참고 |
| `src/root.tsx` | 문서 셸(`<html>`)과 앱 전역 Provider 트리 |
| `src/providers` | 앱 전체를 감싸는 wrapper 컴포넌트 (`QueryProvider`, `ToastProvider` 등) |
| `src/layout` | Sidebar/PageHeader를 조합한 공통 레이아웃 셸 |
| `src/lib` | 공통 유틸리티 |
| `src/types.ts` | 공통 타입 (도메인 전용이면 해당 도메인 파일 근처) |
| `e2e` | E2E 테스트 |

`src/pages/**`의 페이지 컴포넌트와 `src/layout/RootLayout.tsx`는 named export와 함께 **`export default`가 필수**입니다. `src/routes.ts`가 파일 경로로 참조하는 파일 기반 라우팅 관례라, 빠뜨리면 타입체크/테스트는 통과해도 실제 화면에는 아무것도 렌더링되지 않습니다.

`src/routes/(group)/`는 접근 권한 그룹(`(auth)`, `(main)`)을 시각적으로 표시하는 라우트 진입 파일 전용 폴더입니다. 실제 페이지 구현은 `src/pages/{domain}/`에 플랫하게 두고, `src/routes/(group)/{name}.tsx`는 기본적으로 `export { PageComponent as default } from '@pages/{domain}/PageComponent'`처럼 얇게 re-export합니다 — 페이지 컴포넌트가 자신이 어느 접근 그룹에 속하는지 몰라도 되게 하기 위해서입니다. 단, `index.tsx`처럼 페이지 콘텐츠 없이 기본 경로로 이동시키는 경우에는 route-local redirect를 직접 정의할 수 있습니다. `src/routes.ts`는 `src/pages/**`가 아니라 이 `src/routes/(group)/**` 파일을 참조합니다. 근거는 `.claude/decisions/records/005-auth-route-layout-convention.md`.

에러 화면은 페이지(콘텐츠)와 바운더리(메커니즘)를 분리합니다. React Router의 `ErrorBoundary`는 `root.tsx`(또는 필요한 라우트 모듈)의 export 관례라 다른 곳에 둘 수 없지만, `root.tsx`는 `src/pages/errors/GlobalErrorPage.tsx`를 얇게 감싸기만 하고 실제 판별 로직(`useRouteError`/`isRouteErrorResponse`)과 화면 마크업은 각각 `src/pages/errors/`와 `src/components/common/ErrorFallback`에 둡니다. `NotFoundPage`(정상 라우트 매치, `*` catch-all)도 같은 `src/pages/errors/`에 함께 둡니다.

## 도메인 폴더

- 위 표의 루트 폴더는 항상 유지하고, `{domain}` 하위 폴더는 해당 기능 구현을 시작할 때 생성합니다.
- 빈 도메인 폴더를 미리 만들지 않습니다.
- 예상 위치는 `.claude/references/domain/{domain}.md`의 `주요 위치`를 기준으로 하고, 실제 구조가 달라지면 함께 업데이트합니다.

## Import 규칙

가독성이 좋아지는 경우 alias(`@`, `@api`, `@components`, `@hooks`, `@pages`)를 사용하고, 같은 폴더 안의 파일은 상대 import를 우선합니다.

## 경계

- 페이지는 컴포넌트, 훅, API 함수를 조합할 수 있습니다.
- 컴포넌트가 엔드포인트 경로를 직접 알게 하지 않습니다.
- API 함수는 React 컴포넌트를 import하지 않습니다.
- 훅은 API 함수를 TanStack Query로 감쌀 수 있습니다.
- 도메인 모델이 명확해지기 전에는 도메인 간 결합을 피합니다.

## 컴포넌트/훅 폴더 구조

```text
src/components/
├── common/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── Button.stories.tsx
└── members/

src/hooks/
├── common/
└── members/
```

- 재사용 컴포넌트는 `src/components/{domain}/{ComponentName}/{ComponentName}.tsx`처럼 컴포넌트별 폴더에 두고, `.test.tsx`/`.stories.tsx`를 co-locate합니다. `pnpm gen:index`가 이 구조를 재귀적으로 인식해 barrel `index.ts`를 생성합니다.
- 같은 도메인의 다른 컴포넌트를 참조할 때는 `../ComponentName` 상대 import를 사용합니다.
- `src/pages/{domain}/hooks`, `model`, `ui`처럼 FSD식 page-local 세그먼트는 만들지 않습니다.
