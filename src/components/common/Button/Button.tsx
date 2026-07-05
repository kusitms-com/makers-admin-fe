import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '@lib/tv'

const buttonVariants = tv({
  base: 'flex items-center justify-center gap-1 text-center transition-colors',
  variants: {
    variant: {
      primary: 'bg-blue-5 text-brand-primary',
      strong: 'bg-brand-primary text-fill-normal',
      error: 'bg-red-10 text-red-70',
      disable: 'bg-fill-alternative text-label-light cursor-not-allowed',
      outlined: 'bg-fill-normal border-line-normal text-label-netural border',
    },
    size: {
      s: 'text-label-14sb h-9 rounded-md pr-4 pl-4',
      m: 'text-label-14sb h-10 rounded-lg pr-5 pl-5',
      l: 'text-body-16sb h-11 rounded-lg pr-6 pl-6',
      xl: 'text-body-16sb h-12 rounded-lg pr-6 pl-6',
    },
  },
  compoundVariants: [
    // size=m의 strong만 Figma에서 8px 16px로, 같은 size의 다른 variant(8px 20px)보다 좁다.
    { variant: 'strong', size: 'm', class: 'pr-4 pl-4' },
    // outlined는 사이즈와 무관하게 radius 8px + 아이콘 쪽(왼쪽) 패딩이 좁은 비대칭 패딩을 쓴다.
    { variant: 'outlined', size: ['s', 'm'], class: 'rounded-md py-2 pr-4 pl-3' },
    { variant: 'outlined', size: ['l', 'xl'], class: 'rounded-md py-2 pr-5 pl-[18px]' },
  ],
})

type ButtonVariants = VariantProps<typeof buttonVariants>
export type ButtonVariant = NonNullable<ButtonVariants['variant']>
export type ButtonSize = NonNullable<ButtonVariants['size']>

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant
  size: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant,
  size,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled ?? variant === 'disable'}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
