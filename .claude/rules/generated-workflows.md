# 생성 워크플로우 규칙

이 문서는 스크립트로 생성되는 파일을 다룰 때 읽습니다. 생성물은 직접 수정하지 않고 원본 파일이나 스크립트를 수정한 뒤 재생성합니다.

## Barrel Index

`pnpm gen:index`는 공용 export 표면만 관리합니다.

대상:

- `src/components/index.ts`
- `src/components/<domain>/index.ts`
- `src/hooks/index.ts`
- `src/hooks/<domain>/index.ts`

제외:

- `src/pages`
- `src/api`
- FSD식 page-local `model`, `ui`, `hooks`

규칙:

- `src/components/common`은 전역 재사용 UI 컴포넌트만 export합니다.
- `src/components/<domain>`은 해당 도메인 UI 컴포넌트만 export합니다.
- `src/hooks/common`은 전역 재사용 hook만 export합니다.
- `src/hooks/<domain>`은 해당 도메인 hook만 export합니다.
- 특정 페이지/도메인에서만 쓰는 hook도 FSD식 page-local 폴더가 아니라 `src/hooks/<domain>`에 둡니다.
- index 생성물을 직접 고치지 말고 `pnpm gen:index`를 실행합니다.
- 동기화 확인은 `pnpm gen:index:check`로 합니다.

## Icon Generation

아이콘 원본 위치:

```text
src/assets/icons/
├── svg/           # 단색 아이콘. fill/stroke는 currentColor로 정규화
├── svg-preserve/  # 로고/브랜드처럼 원본 색상을 유지할 SVG
└── generated/     # pnpm icons:build 생성물
```

규칙:

- 일반 아이콘은 `src/assets/icons/svg`에 둡니다.
- 로고, 브랜드, 멀티컬러 자산처럼 색상을 유지해야 하는 SVG는 `src/assets/icons/svg-preserve`에 둡니다.
- 생성된 React 컴포넌트는 `src/assets/icons/generated`에 생깁니다.
- generated 파일은 직접 수정하지 말고 원본 SVG 또는 `scripts/build-icons.ts`를 수정합니다.
- SVG 추가/수정 후 `pnpm icons:build`를 실행합니다.
- 동기화 확인은 `pnpm icons:check`로 합니다.

## CI

CI는 생성물이 최신인지 확인합니다.

- `pnpm icons:check`
- `pnpm gen:index:check`

실패하면 생성물을 직접 고치지 말고 로컬에서 대응하는 build/generate 명령을 실행한 뒤 결과를 커밋합니다.
