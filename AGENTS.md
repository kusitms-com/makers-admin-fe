# kusitms-admin

KUSITMS 관리자 패널. React 19 + Vite 기반 SPA.

## Stack

- **언어**: TypeScript ~6.0
- **프레임워크**: React 19 + Vite 8
- **스타일**: Tailwind CSS v4 (PostCSS 아닌 Vite 플러그인 방식)
- **컴포넌트**: @kusitms.com/ui → shadcn/ui → Base UI 순으로 우선
- **아이콘**: @kusitms.com/icons (lucide-react는 보완용)
- **디자인 토큰**: @kusitms.com/tokens
- **서버 상태**: TanStack Query v5
- **클라이언트 상태**: Zustand v5
- **폼**: React Hook Form v7 + Zod v4
- **패키지 매니저**: pnpm (npm/yarn 사용 금지)

## Commands

```bash
pnpm dev           # 개발 서버
pnpm build         # tsc -b && vite build
pnpm lint          # ESLint
pnpm test          # Vitest (watch)
pnpm test:e2e      # Playwright
pnpm test:coverage # 커버리지 리포트
```

## Directory Structure

```
src/
├── api/          # API 호출 함수
├── assets/       # 정적 파일
├── components/   # 재사용 UI 컴포넌트
├── hooks/        # 커스텀 훅
├── lib/          # 유틸리티 (utils.ts 등)
├── pages/        # 페이지 컴포넌트
└── types.ts      # 공통 타입
e2e/              # Playwright E2E 테스트
```

## Conventions

- 컴포넌트 파일명: PascalCase (`UserTable.tsx`)
- 훅 파일명: camelCase + `use` 접두사 (`useUserList.ts`)
- 서버 데이터 fetch는 TanStack Query 사용 (`useState + useEffect` 금지)
- 스타일은 Tailwind className만 사용 (inline style 금지)
- 색상 하드코딩 금지 → @kusitms.com/tokens 디자인 토큰 사용

## Testing

- 단위/컴포넌트: Vitest + @testing-library/react + happy-dom
- E2E: Playwright (`e2e/` 디렉토리)
- 테스트 파일: 대상 파일과 같은 디렉토리, `.test.tsx` 확장자
