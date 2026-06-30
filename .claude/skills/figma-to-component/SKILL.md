---
name: figma-to-component
description: Figma 디자인을 프로젝트 UI 규칙에 맞는 React 컴포넌트로 구현합니다.
user-invocable: true
argument-hint: <figma-url 또는 screenshot>
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# figma-to-component

Figma 디자인을 `@kusitms.com/ui`, `@kusitms.com/icons`, `@kusitms.com/tokens`, Tailwind CSS v4 기준으로 구현합니다.

## 읽을 문서

1. `.claude/rules/component-guide.md`
2. `.claude/references/component-patterns.md`
3. `.claude/rules/code-style.md`
4. `.claude/rules/code-quality.md`
5. `.claude/rules/verification.md`

## Workflow

### 1단계: 디자인 분석

Figma 또는 스크린샷에서 아래 항목을 먼저 정리합니다.

- 레이아웃 방식: flex, grid, table, form, modal
- 반응형 기준: desktop only, mobile 대응, break point
- 상태: default, hover, disabled, loading, empty, error
- 데이터 의존성: 정적 UI, API 연결 UI, form submit UI

가능하면 매핑표를 먼저 만듭니다.

| Figma 속성 | 값 | 프로젝트 매핑 |
| --- | --- | --- |
| Color | `#...` | `@kusitms.com/tokens` 또는 CSS variable |
| Icon | 아이콘명 | `@kusitms.com/icons` |
| Radius | `...px` | Tailwind radius token |
| Spacing | `...px` | Tailwind spacing token |

### 2단계: 기존 패턴 확인

`.claude/references/component-patterns.md`, `src/components`, `src/pages`, `src/lib`, 기존 CSS/Tailwind 사용 패턴을 확인합니다.
새 컴포넌트를 만들기 전에 `@kusitms.com/ui`로 해결 가능한지 먼저 봅니다.

### 3단계: 파일 위치 결정

| 성격 | 위치 |
| --- | --- |
| 여러 페이지에서 재사용 | `src/components/{ComponentName}.tsx` |
| 특정 페이지 전용 section | `src/pages/{domain}/` 구현 시 생성 |
| API 연결 hook | `src/hooks/use{Domain}.ts` |
| 순수 유틸 | `src/lib` |

### 4단계: 구현

- 데이터 표시 UI는 loading, empty, error 상태를 분리합니다.
- form UI는 React Hook Form + Zod 사용 여부를 먼저 판단합니다.
- 반복 UI는 설정 배열/맵으로 렌더링합니다.
- variant는 `as const` tuple, 파생 union, `satisfies Record<...>` 패턴을 우선합니다.

### 5단계: 결과 보고

```text
생성/수정 파일:
- src/components/...

사용한 디자인 자원:
- @kusitms.com/ui: ...
- @kusitms.com/icons: ...
- @kusitms.com/tokens: ...

검증:
- 실행: ...
- 미실행: ...
```

## Rules

- `@kusitms.com/ui`를 우선 사용합니다.
- 색상 하드코딩을 피하고 `@kusitms.com/tokens` 또는 기존 CSS variable을 사용합니다.
- 아이콘은 `@kusitms.com/icons`를 우선하고, 없으면 `lucide-react`를 사용합니다.
- 복잡한 Figma SVG path를 컴포넌트 안에 직접 작성하지 않습니다.
- `className`은 필요한 경우 노출합니다.
- inline style은 사용하지 않습니다.
- variant는 문자열 union과 `satisfies Record<...>` 패턴을 우선 고려합니다.
- 접근성 있는 button, input, label, dialog primitive를 사용합니다.
- 텍스트 overflow가 가능한 flex/grid 자식에는 `min-w-0`와 `truncate` 필요성을 확인합니다.
- 복잡한 SVG path를 직접 재작성하지 말고 에셋 또는 아이콘 패키지 사용을 우선합니다.
