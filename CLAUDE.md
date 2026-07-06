@.claude/manifest.md

# kusitms-admin

## 사고 방식

- 사용자가 다르게 요청하지 않으면 한국어로 사고하고 응답합니다. 최종 답변뿐 아니라 작업 중간에 나오는 진행 상황 설명, 커밋 메시지 제안, 코드 리뷰 코멘트 등 사용자에게 보이는 모든 텍스트에 적용합니다.
- 코드 식별자(변수/함수/파일명), 터미널 명령어, 라이브러리·패키지 고유명사를 제외하고 영어 문장을 한국어 응답에 섞지 않습니다.
- 구현 전에 관련 파일과 지침을 먼저 확인합니다.
- 작업은 작고 검증 가능한 단위로 나눕니다.

## 프로젝트 요약

KUSITMS 관리자 패널입니다. React 19 + Vite 8 기반 SPA이며, KUSITMS Swagger API를 기준으로 관리자 기능을 구현합니다.

## 기술 스택

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` 플러그인 방식)
- **Components**: `@kusitms.com/ui` -> Base UI 순으로 우선
- **Icons**: `@kusitms.com/icons` 우선, 필요한 경우 `lucide-react` 보완 사용
- **Design Tokens**: `@kusitms.com/tokens`
- **Server State**: TanStack Query v5
- **Client State**: Zustand v5
- **Form**: React Hook Form v7 + Zod v4
- **Testing**: Vitest + Testing Library + happy-dom, Playwright
- **Package Manager**: pnpm

## 주요 명령어

- `pnpm dev`: Vite 개발 서버 실행
- `pnpm build`: TypeScript 프로젝트 빌드 후 Vite 프로덕션 빌드
- `pnpm lint`: ESLint 검사
- `pnpm test`: Vitest watch 모드
- `pnpm test:e2e`: Playwright E2E 테스트
- `pnpm test:coverage`: Vitest 커버리지 리포트

## 검증

- 문서만 변경한 경우: 변경 파일 확인
- 좁은 컴포넌트/훅 변경: 관련 테스트 우선
- 공통 유틸리티/API 변경: 관련 테스트와 `pnpm lint`
- 앱 전반 변경: `pnpm lint`, `pnpm build`
- E2E 영향이 있는 flow: 관련 Playwright 테스트 또는 `pnpm test:e2e`

## 참조 파일

### Boot Loader

@.claude/manifest.md

상세 rule, reference, skill 로딩 기준은 `.claude/manifest.md`에서 관리합니다.
