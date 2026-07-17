# 004. 에러/404 화면은 로직-마크업-바운더리를 분리해 배치한다

## 상태

- Accepted

## 맥락

React Router Framework Mode에서 라우트 매칭 실패(404)와 렌더링 중 예외(500류)는 서로 다른 메커니즘이다. 404는 `*` catch-all이 매칭하는 평범한 라우트라 Sidebar 등 레이아웃이 그대로 유지되지만, 예외는 `root.tsx`(또는 라우트 모듈)의 `ErrorBoundary` export로만 잡을 수 있고 그 라우트 트리 전체가 이 export로 교체된다. 처음에는 두 경우를 구분하지 않고 `*` catch-all 하나에 "준비 중인 페이지입니다"로 뭉뚱그렸다.

## 결정

세 레이어로 나눈다.

- `src/components/common/ErrorFallback` — 순수 마크업(title/description)만 가진 재사용 컴포넌트.
- `src/pages/errors/NotFoundPage.tsx` — `*` catch-all이 매칭하는 정상 라우트. `ErrorFallback`을 404 문구로 렌더링.
- `src/pages/errors/GlobalErrorPage.tsx` — `useRouteError()`/`isRouteErrorResponse()`로 라우트 에러와 일반 예외를 구분해 `ErrorFallback`을 렌더링. `root.tsx`의 `ErrorBoundary` export는 이 컴포넌트를 얇게 감싸기만 한다.

## 근거

- `ErrorBoundary`는 React Router가 export 이름으로 자동 인식하는 관례라 `root.tsx` 밖으로 옮길 수 없다. 대신 `root.tsx`를 얇게 유지하고 실제 판별 로직은 테스트 가능한 `GlobalErrorPage`에 둔다.
- `src/pages/{domain}/`처럼 도메인 폴더로 나누는 기존 컨벤션을 그대로 따라 `errors`를 cross-cutting pseudo-domain으로 취급했다 — 새 최상위 카테고리를 만들지 않았다.
- 404(정상 라우트, Sidebar 유지)와 예외(전체 화면 교체)를 같은 문구로 섞으면, 아직 안 만든 사이드바 메뉴를 눌렀을 때도 "오류"처럼 보여 사용자에게 잘못된 신호를 준다.

## 대안

- `*` catch-all 하나로 404/예외를 모두 처리: 구현은 더 단순하지만 정상적인 미구현 상태와 실제 장애를 구분할 수 없어 기각.
- `ErrorBoundary` 로직을 `root.tsx`에 직접 작성: React Router 관례상 위치는 강제되지만, 로직이 `root.tsx`에 섞이면 단위 테스트하기 번거로워져 기각.

## 영향

- 새로운 예상 에러 상태(예: 특정 도메인 페이지의 loader 실패)를 만들 때도 이 3단 분리(마크업/페이지/바운더리)를 따른다.
- 사이드바에 메뉴는 있지만 페이지가 아직 없는 경로는 `src/routes.ts`에 등록하지 않는다 — 등록하지 않으면 `*` catch-all이 `NotFoundPage`로 받아 처리한다.
