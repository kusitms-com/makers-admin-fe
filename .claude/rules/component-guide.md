# 컴포넌트 가이드

## 우선순위

1. 적절한 컴포넌트가 있으면 `@kusitms.com/ui`를 사용합니다.
2. 접근성 있는 저수준 동작이 필요하면 Base UI primitive를 사용합니다.
3. 프로젝트 라이브러리로 해결되지 않을 때만 커스텀 컴포넌트를 만듭니다.
4. 아이콘은 `@kusitms.com/icons`를 우선하고, 없으면 `src/assets/icons/generated`(프로젝트 전용 아이콘)를 확인하고, 그래도 없을 때만 `lucide-react`를 사용합니다.

## 관리자 UI 기본값

- 밀도 있고 스캔하기 쉬운 업무 중심 레이아웃을 우선합니다.
- 마케팅식 카드보다 table, filter, tab, dialog, drawer, form을 우선합니다.
- 반복 아이템 카드는 간결하게 유지하고 장식용 중첩 카드는 피합니다.
- 데이터 기반 화면에는 loading, empty, error 상태를 명확히 둡니다.
- 액션은 영향을 주는 데이터 가까이에 배치합니다.

## 접근성

- 의미 있는 button과 form control을 사용합니다.
- input에는 보이는 label 또는 접근 가능한 label을 둡니다.
- dialog/drawer는 focus management를 처리하는 primitive를 사용합니다.
- 상태 표현을 색상에만 의존하지 않습니다.

## 컴포넌트 구조

```tsx
import { type ComponentPropsWithRef } from 'react'
import { tv } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-md font-medium',
  variants: {
    variant: {
      primary: 'bg-primary text-white',
      secondary: 'bg-gray-100 text-gray-900',
      ghost: 'bg-transparent hover:bg-gray-100',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = ({ variant, size, className, ref, type = 'button', ...props }: ButtonProps) => {
  return (
    <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
  )
}
```

### 필수

- `className` prop 항상 노출 — 외부에서 스타일 오버라이드 가능하게
- `ref` prop 항상 노출
- 나머지 props는 `...props`로 전달
- 스타일 변형은 `tailwind-variants`(`tv`) 사용

### 네이밍

- 컴포넌트 파일: PascalCase (`Button.tsx`)
- 컴포넌트 함수: PascalCase (`export const Button`)
- props 타입: `{컴포넌트명}Props` (`ButtonProps`)
- variants: `{컴포넌트명}Variants` (`buttonVariants`)

## 컴포넌트 패턴

### Variant pattern

시각 상태는 `tailwind-variants`로 관리. 잘못된 조합을 타입 단계에서 차단.

```tsx
const buttonVariants = tv({
  variants: {
    variant: { primary: '...', strong: '...', error: '...' },
    size: { s: '...', m: '...', l: '...' },
  },
})
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
```

### Controlled component

상태는 부모가 관리, 컴포넌트는 props 수신 후 렌더링과 콜백만.

```tsx
interface ControlProps {
  value: string
  onValueChange: (value: string) => void
  items: Item[]
}
```

### Slot props

구조는 컴포넌트가 책임, 특정 위치 UI(icon, action, children)만 주입.

```tsx
<PageHeader title="제목" actionLabel="추가" onAction={handleCreate} />
<Button leftIcon={<Icon />}>버튼</Button>
```

### 배열 + 설정 객체

반복 UI는 데이터 배열로 렌더링. 데이터와 렌더 로직 분리.

```tsx
const NAV_ITEMS: NavConfig[] = [
  { key: 'intro', label: '소개', icon: Icon },
]
{NAV_ITEMS.map(item => <button key={item.key}>{item.label}</button>)}
```

## 피해야 할 패턴

- 시각 상태를 boolean props로 남발 대신 variant로 통합
- 컴포넌트 내부에서 상태 관리 대신 controlled component로 부모 제어
- 모든 조각을 props로 받기 대신 slot props로 특정 위치만 주입
- JSX에 데이터 하드코딩 대신 배열/객체로 렌더링
- 인라인 스타일 대신 Tailwind className 사용
- 하드코딩된 색상/크기 대신 디자인 토큰 사용
