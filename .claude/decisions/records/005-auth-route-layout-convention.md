# 005. 라우트는 접근 그룹(`src/routes/(group)/`)과 페이지 구현(`src/pages/`)을 분리한다

## 상태

- Accepted

## 맥락

로그인 기능은 아직 구현되지 않았지만(`.claude/references/api/admin-auth.md` 참고), 나중에 다른 작업자가 구현할 때 라우트 구조를 다시 논쟁하지 않도록 미리 컨벤션을 정해둔다. `Leets-Official/LOOPIT-FE`를 참고했는데, `(auth)`/`(main)` 같은 괄호 폴더명은 React Router의 fs-routes 기능이 아니라(`@react-router/fs-routes` 미설치, `routes.ts` config 방식 사용) 순수 시각적 그룹핑이었다. 실제 페이지 구현(`src/pages`)은 플랫하게 두고, `src/routes/(group)/*.tsx`는 `import { X } from '@pages/...'; export default X`처럼 페이지를 얇게 re-export만 하는 라우트 진입 파일이었다.

## 결정

- **`src/pages/{domain}/`는 접근 그룹을 모른다.** 도메인 기준으로만 플랫하게 나눈다(`pages/reviews/`, `pages/errors/`, 나중에 `pages/auth/LoginPage.tsx`). `(auth)`/`(main)` 폴더를 `src/pages` 아래에 만들지 않는다 — 도메인 축과 접근 권한 축, 두 분류 기준이 같은 트리에서 경쟁하는 걸 피하기 위해서다.
- **`src/routes/(group)/`가 접근 그룹을 표시한다.** 기본적으로 실제 페이지 컴포넌트를 얇게 re-export만 하는 라우트 진입 파일을 둔다. 다만 `index.tsx`처럼 페이지 콘텐츠 없이 접근 가능한 기본 경로로 이동시키는 경우에는 route-local redirect를 직접 정의할 수 있다. 이미 있음: `src/routes/(main)/index.tsx`, `src/routes/(main)/introduction.tsx`, `src/routes/(main)/review.tsx`, `src/routes/(main)/notFound.tsx`. `src/routes/(auth)/`는 아직 `.gitkeep`만 있다(로그인 페이지가 없어서).
- **네이밍**: 라우트 진입 파일은 camelCase(`notFound.tsx`) — 컴포넌트를 정의하지 않는 re-export 파일이라 컴포넌트 파일의 PascalCase 규칙과 구분한다. 근거는 `.claude/rules/code-style.md`.
- **레이아웃 3단, 셋 다 아직 만들지 않는다.** 로그인 라우트가 실제로 생길 때 함께 만든다 — 지금 만들면 어떤 라우트도 참조하지 않는 미사용 코드로 남는다(`src/pages/(auth)`를 미리 만들지 않기로 한 것과 같은 이유).
  - `src/layout/PublicLayout.tsx` — Sidebar 없이 `Outlet`만 감싼다. `login`/`signup` 라우트가 생길 때 함께 만든다.
  - `src/layout/RootLayout.tsx` — 이미 있고 계속 그대로 쓴다. `MainLayout`으로 이름을 바꾸거나 새로 만들지 않는다.
  - `src/layout/PrivateLayout.tsx` — `role === 'ADMIN'` 확인 후 아니면 `/login`으로 리다이렉트해야 하는데, 토큰 저장 방식이 아직 안 정해졌다(`admin-auth.md` 참고). 통과만 시키는 스텁을 미리 만들면 실제로는 아무것도 막지 않아, 로그인 없이 접근 가능한 상태를 "보호됨"으로 착각하게 만들 위험이 있다.
- **`routes.ts` 최종 형태 예시** (로그인 페이지 추가 시):

```ts
export default [
  layout('layout/PublicLayout.tsx', [route('login', 'routes/(auth)/login.tsx')]),

  layout('layout/PrivateLayout.tsx', [
    layout('layout/RootLayout.tsx', [
      index('routes/(main)/index.tsx'),
      route('review', 'routes/(main)/review.tsx'),
      route('*', 'routes/(main)/notFound.tsx'),
    ]),
  ]),
] satisfies RouteConfig
```

```ts
// src/routes/(auth)/login.tsx
export { LoginPage as default } from '@pages/auth/LoginPage'
```

## 근거

- 페이지 컴포넌트가 자신의 접근 그룹을 몰라도 되면, 나중에 어떤 페이지가 public↔protected로 바뀌거나 여러 라우트에서 재사용돼도 `src/pages` 쪽은 안 건드리고 `src/routes/(group)/` 쪽 파일 위치만 옮기면 된다.
- 라우트가 지금처럼 1~2개일 때는 이 간접 참조 계층이 오히려 손해지만(파일이 하나 더 늘고 추적 hop이 하나 늘어난다), 8개 안팎으로 늘어나면 `routes.ts` 하나를 끝까지 읽는 것보다 `src/routes/(main)/` 폴더를 훑는 게 더 빨라지는 지점을 넘는다. 이 프로젝트는 조만간 그 규모가 될 예정이라 미리 이 구조로 간다.
- `PrivateLayout` 스텁을 지금 만들면 "이미 있으니 그대로 쓰면 되겠지"라고 오해하고 실제 체크 없이 라우트에 연결될 위험이 있다 — 없는 채로 두는 편이 "아직 안 만들었다"를 명확히 드러낸다.

## 대안

- `src/pages/(auth)/`, `src/pages/(main)/`처럼 페이지 폴더 자체를 접근 그룹으로 재편: 도메인 축과 접근 권한 축이 같은 트리에서 경쟁해 기각.
- 라우트가 적을 때는 `routes.ts`가 `src/pages/**`를 직접 참조(re-export 계층 없이): 지금 당장은 더 단순하지만, 로그인 포함 8개 안팎까지 늘어날 예정이라 미리 이 구조로 맞췄다.
- `PrivateLayout`을 통과용 스텁으로 미리 만들어둔다: 보호되고 있다고 착각할 위험이 있어 기각.

## 영향

- 새 도메인 페이지를 추가하면 `src/pages/{domain}/{Page}.tsx`는 그대로 플랫하게 만들고, `src/routes/(main)/{name}.tsx`에 `export { Page as default } from '@pages/{domain}/Page'` 형태의 라우트 진입 파일을 추가한 뒤 `routes.ts`에 등록한다.
- 로그인 페이지를 구현하는 사람은 `src/pages/auth/LoginPage.tsx`를 만들고, `src/routes/(auth)/login.tsx`로 re-export한 뒤 `routes.ts`에 `layout('layout/PublicLayout.tsx', [...])` 브랜치를 추가한다.
- `PrivateLayout`을 구현하는 사람은 `admin-auth.md`의 토큰 저장/역할 확인 전략이 확정된 뒤 작성하고, `RootLayout`을 감싸는 형태로 `routes.ts`에 끼워 넣는다.
- `RootLayout`은 이 작업으로 인해 변경되지 않았다.
