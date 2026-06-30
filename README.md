# Makers Admin FE

## Tech Stack

- **Framework**: React 19 + Vite (TypeScript)
- **Package Manager**: pnpm
- **State**: Zustand (global), TanStack Query (server)
- **Form**: React Hook Form + Zod
- **UI**: shadcn + Tailwind CSS v4 + [@kusitms.com/ui](https://github.com/kusitms-com/makers-design-system)
- **Test**: Vitest + React Testing Library
- **E2E**: Playwright

## Getting Started

```bash
git clone https://github.com/kusitms-com/makers-admin-fe.git
cd makers-admin-fe
pnpm install
pnpm dev
```

## Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `pnpm dev`             | 개발 서버 실행           |
| `pnpm build`           | 프로덕션 빌드            |
| `pnpm type-check`      | TypeScript 검사          |
| `pnpm lint`            | ESLint 검사              |
| `pnpm format:check`    | Prettier 검사            |
| `pnpm gen:index`       | barrel index 생성        |
| `pnpm gen:index:check` | barrel index 동기화 검사 |
| `pnpm icons:build`     | SVG 아이콘 생성          |
| `pnpm icons:check`     | 아이콘 동기화 검사       |
| `pnpm test`            | 단위 테스트              |
| `pnpm test:coverage`   | 커버리지 리포트          |
| `pnpm test:e2e`        | E2E 테스트               |

## Project Structure

```text
src/
├── api/          # API client와 TanStack Query hook
├── assets/       # 이미지와 SVG 아이콘 원본/생성물
├── components/   # UI 컴포넌트. common 또는 domain 폴더로 구분
├── hooks/        # React hook. common 또는 domain 폴더로 구분
├── lib/          # 유틸리티
├── pages/        # 라우트 진입점과 페이지 조립
├── test/         # 테스트 setup
└── types.ts      # 공통 타입
```

상세 구조와 생성 워크플로우 규칙은 `.claude/manifest.md`에서 연결된 rules 문서를 기준으로 합니다.

## 개발 가이드

API 작업 방식, 컴포넌트 선택 기준, 생성 파일 워크플로우 등 팀 개발 규칙은 [docs/development.md](docs/development.md)를 참고하세요.

## Path Aliases

| Alias           | Path               |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@api/*`        | `src/api/*`        |
| `@components/*` | `src/components/*` |
| `@hooks/*`      | `src/hooks/*`      |
| `@lib/*`        | `src/lib/*`        |
| `@pages/*`      | `src/pages/*`      |
