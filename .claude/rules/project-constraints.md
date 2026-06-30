# 프로젝트 제약 조건

이 문서는 `kusitms-admin`에서 항상 지켜야 하는 금지/제약 조건을 정의합니다.

## 패키지 매니저

- `pnpm`만 사용합니다.
- `npm install`, `yarn install`, `npm run`, `yarn` 명령을 사용하지 않습니다.

## Tailwind CSS

- Tailwind CSS v4는 `@tailwindcss/vite` 플러그인 방식으로 사용합니다.
- 명시 요청 없이는 Tailwind v3 기준 `tailwind.config.js`를 만들지 않습니다.

## 데이터 패칭

- 서버 데이터 fetch를 `useState + useEffect`로 직접 처리하지 않습니다.
- 서버 상태는 TanStack Query를 사용합니다.

## API 계약

- Swagger 또는 `.claude/references/api` 확인 없이 endpoint path, request body, response shape를 추측하지 않습니다.
- 새 API를 사용하면 관련 reference 문서를 먼저 업데이트합니다.

## 디렉터리 구조

- `src/services`, `src/views` 같은 새 구조를 임의로 만들지 않습니다.
- API 요청 함수는 `src/api`, hook은 `src/hooks`, 재사용 UI는 `src/components`, 페이지는 `src/pages`에 둡니다.

## 의존성

- production dependency 추가 전에는 확인을 받습니다.
- UI 라이브러리는 `@kusitms.com/ui` -> shadcn/ui -> Base UI 순으로 우선합니다.
