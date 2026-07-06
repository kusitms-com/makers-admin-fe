# Development Guide

팀원이 알아두어야 할 이 프로젝트 고유의 개발 규칙을 설명합니다.
기본 명령어와 기술 스택은 [README](../README.md)를 참고하세요.

## API 작업

endpoint 경로, request body, response 타입을 추측해서 작성하지 않습니다.

1. `.claude/references/api/admin.md`에서 관련 endpoint를 먼저 확인합니다.
2. 없으면 Swagger에서 찾고 reference 파일을 업데이트한 뒤 구현합니다.
3. 요청 함수는 `src/api/{domain}.ts`, TanStack Query hook은 `src/hooks/{domain}/`에 둡니다.
4. 서버 데이터를 `useState + useEffect`로 직접 fetch하지 않습니다.

## 컴포넌트 선택 우선순위

1. `@kusitms.com/ui` — 프로젝트 공용 컴포넌트 라이브러리
2. Base UI primitive (접근성 있는 저수준 동작이 필요할 때)
3. 커스텀 컴포넌트 (위 두 가지로 해결 안 될 때만)

아이콘은 `@kusitms.com/icons` 우선, 없으면 `lucide-react`를 사용합니다.

## 컴포넌트 파일 구조

재사용 컴포넌트는 `src/components/{domain}/{ComponentName}/{ComponentName}.tsx`처럼 컴포넌트별 폴더에 두고, 같은 폴더에 `.test.tsx`/`.stories.tsx`를 co-locate합니다.

```text
src/components/common/Button/
├── Button.tsx
├── Button.test.tsx
└── Button.stories.tsx
```

같은 도메인의 다른 컴포넌트를 참조할 때는 `../ComponentName` 상대 import를 사용합니다. 자세한 배경은 `.claude/decisions/records/002-component-per-folder.md` 참고.

## 생성 파일 워크플로우

아이콘과 barrel index는 스크립트로 생성되며 CI에서 동기화 여부를 검사합니다.
생성 파일을 직접 수정하면 안 됩니다.

**SVG 아이콘을 추가하거나 수정했을 때**

```bash
pnpm icons:build
```

- 단색 아이콘은 `src/assets/icons/svg/`에 추가합니다.
- 로고처럼 색상을 유지해야 하는 SVG는 `src/assets/icons/svg-preserve/`에 추가합니다.

**컴포넌트나 훅을 추가했을 때**

```bash
pnpm gen:index
```

- `src/components/`, `src/hooks/` 하위 파일을 추가하면 실행합니다.
- `src/pages/`, `src/api/`는 대상이 아닙니다.

이 두 가지를 빠뜨리면 CI의 Generated 항목이 실패합니다.

## 커밋

커밋 메시지는 `/commit-kr` agent skill로 작성하거나, `husky` + `commitlint`의 `commit-msg` 훅으로 자동 검사됩니다. type 종류와 subject 작성 기준은 `.claude/rules/commit-convention.md` 참고.

## 환경변수

`.env` 파일이 필요합니다. 키는 팀 인수인계로 전달받습니다.
