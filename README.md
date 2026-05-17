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
git clone --recurse-submodules https://github.com/kusitms-com/makers-admin-fe.git
cd makers-admin-fe
pnpm install
pnpm dev
```

## Scripts

| Command              | Description     |
| -------------------- | --------------- |
| `pnpm dev`           | 개발 서버 실행  |
| `pnpm build`         | 프로덕션 빌드   |
| `pnpm test`          | 단위 테스트     |
| `pnpm test:coverage` | 커버리지 리포트 |
| `pnpm test:e2e`      | E2E 테스트      |

## Project Structure

```
src/
├── features/        # 기능 단위 모듈
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── types.ts
└── shared/          # 공통 모듈
    ├── ui/          # shadcn + 디자인 시스템 컴포넌트
    └── lib/         # 유틸리티
```
