# 003. 라우팅은 React Router Framework Mode(SPA)로 한다

## 상태

- Accepted

## 맥락

`react-router`는 의존성으로만 설치돼 있고 `App.tsx`는 `RouterProvider`/`BrowserRouter` 없이 아무것도 렌더링하지 않는 상태였다. 첫 페이지(`/review`)를 구현하면서 라우팅을 실제로 붙여야 했고, 이후 React Router를 Framework Mode로 전환하기로 했다.

## 결정

`@react-router/dev`를 추가하고 `react-router.config.ts`에서 `ssr: false`, `appDirectory: 'src'`로 설정해 SPA 모드로 빌드한다(SSR 서버 없이 정적 `build/client`만 생성). 라우트는 `src/routes.ts`에서 `@react-router/dev/routes` 헬퍼(`layout`/`index`/`route`)로 선언한다. 문서 셸(`<html>`, Provider 트리)은 `src/App.tsx`/`src/main.tsx`/`index.html` 대신 `src/root.tsx` 하나가 담당한다.

## 근거

- 파일 경로 기반 수동 `createBrowserRouter` 배열보다 라우트-페이지 매핑이 `src/routes.ts` 한 파일에 명시적으로 드러난다.
- `appDirectory: 'src'`로 지정해 기존 `src/pages`, `src/components` 등 디렉터리 구조를 그대로 유지했다 — `app/` 폴더로 옮기지 않았다.
- SSR 서버(Node 런타임, 배포 인프라)가 필요 없는 관리자 SPA라 `ssr: false`로 빌드 산출물을 정적 파일(`build/client`)로 유지한다.

## 대안

- `createBrowserRouter` + `RouterProvider`로 계속 수동 구성: 별도 dependency가 없어 가볍지만, 라우트 파일과 컴포넌트 트리를 손으로 동기화해야 하고 파일 기반 라우팅의 관례(각 라우트 모듈이 `default export`를 가진다)를 강제할 수 없어 기각.
- Framework Mode + SSR: 이 프로젝트는 관리자 전용 내부 도구라 SEO/초기 로딩 이점이 크지 않고, Node 서버 배포 부담만 늘어 기각.

## 영향

- 페이지 컴포넌트(`src/pages/**`)와 레이아웃(`src/layout/RootLayout.tsx`)은 named export와 함께 **`export default`를 반드시 가져야** `src/routes.ts`에서 파일 경로로 참조할 수 있다. 빠뜨리면 `tsc`/`eslint`/`vitest`는 통과하지만 실제 브라우저에서는 빈 화면이 렌더링된다 — 브라우저로 직접 확인 없이는 안 잡힌다.
- 새 페이지를 추가하면 `src/pages/{domain}/{PageName}.tsx`를 만들고 `src/routes.ts`에 `route('path', 'pages/{domain}/{PageName}.tsx')`를 등록한다.
- 테스트는 `vite.config.ts`(reactRouter() 플러그인 포함)가 아니라 별도 `vitest.config.ts`를 사용한다 — reactRouter() 플러그인이 생성하는 라우트/서버 빌드용 가상 모듈이 vitest 환경과 맞지 않기 때문이다. `vite.config.ts`의 alias를 바꾸면 `vitest.config.ts`도 함께 바꿔야 한다.
- `pnpm dev`/`pnpm build` 명령은 각각 `react-router dev`/`react-router build`로 바뀌었다. 빌드 산출물은 `dist`가 아니라 `build/client`(정적 파일)이고, `pnpm preview`는 `--outDir build/client`를 명시한다.
- Storybook(`.storybook/main.ts`)은 자체 `viteFinal`로 독립된 Vite 설정을 쓰므로 이번 변경과 무관하다.
