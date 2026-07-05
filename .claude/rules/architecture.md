# 아키텍처 규칙

## 프로젝트 형태

`kusitms-admin`은 React 19 + Vite 8 기반 관리자 SPA입니다. 앱 규모가 커져 더 강한 계층화가 필요해지기 전까지는 단순한 구조를 유지합니다.

## 파일 배치

| 위치 | 용도 |
| --- | --- |
| `src/api` | API 클라이언트, 요청 함수 |
| `src/components` | 재사용 UI 컴포넌트 (`common` 또는 `{domain}`) |
| `src/hooks` | 커스텀 훅 (`common` 또는 `{domain}`) |
| `src/pages` | 라우트 진입점, 페이지 조립 |
| `src/routes` | 라우터 설정, 라우트 정의 |
| `src/layout` | Sidebar/PageHeader를 조합한 공통 레이아웃 셸 |
| `src/lib` | 공통 유틸리티 |
| `src/types.ts` | 공통 타입 (도메인 전용이면 해당 도메인 파일 근처) |
| `e2e` | E2E 테스트 |

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
