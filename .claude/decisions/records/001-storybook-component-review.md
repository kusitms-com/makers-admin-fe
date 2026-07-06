# 001. UI 컴포넌트 시각 검토는 Storybook + GitHub Pages 배포로 한다

## 상태

- Accepted

## 맥락

공통 컴포넌트(Sidebar, PageHeader, SegmentedControl, Button, Logo)와 도메인 카드 컴포넌트가 늘어나면서, 실제 라우팅 없이도 팀원이 UI를 눈으로 확인할 방법이 필요했다. 앱 내부에 임시 `playground` 라우트를 만드는 방법과 Storybook을 붙이는 방법을 검토했다.

## 결정

`storybook` + `@storybook/react-vite`(Vite 8 지원 확인됨)를 devDependency로 추가하고, `main` 브랜치 push 시 `.github/workflows/deploy-storybook.yml`이 GitHub Pages(`/makers-admin-fe/` 서브패스)에 정적 빌드를 배포한다.

## 근거

- 컴포넌트가 늘어나도 `ComponentName.stories.tsx`를 옆에 추가하는 것만으로 확장되고, 임시 라우트처럼 삭제를 깜빡할 위험이 없다.
- 팀원이 앱을 로컬에서 띄우지 않고도 배포된 페이지에서 바로 확인 가능하다.
- `storybook init`의 기본 `--features` 중 `test`(Vitest 브라우저 addon + Playwright 브라우저 바이너리)는 스코프 밖이라 제외하고 `docs`, `a11y`만 설치했다.

## 대안

- 앱 내부 `routes`/`playground` 라우트: 지금 당장은 더 빠르지만, 실제 라우팅에 임시 코드가 섞여 남을 위험이 있어 기각.
- Storybook `test`/Chromatic 관련 addon: 컴포넌트 시각 확인이 목적이라 지금은 불필요, 필요해지면 별도로 추가.

## 영향

- 새 재사용 컴포넌트를 추가하면 `ComponentName.tsx` 옆에 `ComponentName.stories.tsx`를 함께 추가한다(테스트 파일과 동일한 co-location 관례).
- `.storybook/main.ts`의 `viteFinal`이 `vite.config.ts`와 동일한 alias(`@`, `@api`, `@components`, `@hooks`, `@lib`, `@pages`)와 `@tailwindcss/vite` 플러그인을 그대로 반영한다 — `vite.config.ts`의 alias나 플러그인을 바꾸면 `.storybook/main.ts`도 함께 업데이트해야 한다.
- `.storybook/preview.tsx`가 `src/index.css`를 import하므로, 전역 스타일/토큰 변경은 Storybook에도 자동 반영된다.
- GitHub Pages 배포는 `STORYBOOK_BASE_PATH` 환경변수로 서브패스(`/makers-admin-fe/`)를 처리한다 — 저장소 이름이 바뀌면 `deploy-storybook.yml`의 값도 함께 바꿔야 한다.
