# 002. 재사용 컴포넌트는 컴포넌트별 폴더로 관리한다

## 상태

- Accepted

## 맥락

`src/components/common`에 `Button.tsx`, `Button.test.tsx`, `Button.stories.tsx`처럼 컴포넌트당 파일이 3개씩 쌓이면서 평면 구조가 스캔하기 번거로워졌다.

## 결정

`src/components/{domain}/{ComponentName}/{ComponentName}.tsx` 형태로 컴포넌트별 폴더를 만들고, 같은 폴더에 `.test.tsx`/`.stories.tsx`를 co-locate한다. `scripts/gen-index.ts`를 재귀 구조로 바꿔 컴포넌트 폴더와 도메인 폴더 각각의 barrel `index.ts`를 자동 생성하게 했다.

## 근거

- 컴포넌트 하나당 관련 파일이 한 폴더에 모여 탐색이 쉬워진다.
- `@components/common/Button` 같은 기존 alias 딥 임포트는 폴더+barrel 구조에서도 그대로 resolve되어, 외부에서 이 컴포넌트를 참조하던 코드는 수정할 필요가 없었다.
- 같은 도메인 내 다른 컴포넌트를 참조할 때는 `../ComponentName` 상대 import를 쓴다(예: `PageHeader` → `Button`, `Sidebar` → `Logo`).

## 대안

- 평면 구조 유지: 파일 수가 적을 때는 문제 없지만, 컴포넌트마다 test/stories가 늘어나며 이미 스캔하기 어려워진 상태라 기각.

## 영향

- 새 재사용 컴포넌트를 추가할 때는 `common/Button/` 같은 컴포넌트 폴더부터 만든다. `.claude/rules/architecture.md`의 도메인 구조 예시 참고.
- `src/components/common`, `introductions`, `projects` 전 도메인을 이 구조로 옮겼다. 새 도메인도 처음부터 이 구조로 만든다.
- `pnpm gen:index` 실행 시 컴포넌트 폴더 depth와 무관하게 재귀적으로 barrel을 생성하므로, 이후 깊이가 더 깊어져도 스크립트 수정 없이 동작한다.
