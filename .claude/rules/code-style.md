# 코드 스타일 규칙

## TypeScript

- API 응답과 폼 데이터에는 명시적인 도메인 타입을 우선 사용합니다.
- 불필요한 `any`를 피하고, 실제로 형태를 모를 때는 `unknown`을 사용합니다.
- 재사용되기 전까지 타입은 기능 근처에 둡니다.
- UI에서 아직 쓰지 않는 필드까지 과하게 모델링하지 않습니다.

## React

- 함수 컴포넌트를 사용합니다.
- 페이지 컴포넌트는 조합과 데이터 흐름에 집중합니다.
- 재사용되거나 의미 있는 복잡도가 생긴 뒤에 컴포넌트를 분리합니다.
- 서버 데이터를 전역 상태로 만들지 않고 TanStack Query를 사용합니다.

## 네이밍

- 컴포넌트 파일: PascalCase, 예: `UserTable.tsx`
- 훅 파일: `use` 접두사의 camelCase, 예: `useUserList.ts`
- API 파일: 도메인 중심 이름, 예: `members.ts`, `projects.ts`, `reviews.ts`
- 테스트 파일: 대상 파일과 같은 위치에 `.test.ts` 또는 `.test.tsx`

## 스타일링

- Tailwind `className`을 사용합니다.
- inline style은 피합니다.
- 색상과 의미 값은 `@kusitms.com/tokens`의 디자인 토큰을 우선 사용합니다.
- 컴포넌트는 `@kusitms.com/ui`를 우선하고, 그다음 shadcn/ui 또는 Base UI를 사용합니다.
- 아이콘은 `@kusitms.com/icons`를 우선하고, 프로젝트 아이콘이 없을 때만 `lucide-react`를 사용합니다.
