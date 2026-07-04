import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@lib/utils'

export type ButtonVariant = 'primary' | 'strong' | 'error' | 'disable' | 'outlined'
export type ButtonSize = 's' | 'm' | 'l' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant
  size: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-blue-5 text-brand-primary',
  strong: 'bg-brand-primary text-fill-normal',
  error: 'bg-red-10 text-red-70',
  disable: 'bg-fill-alternative text-label-light',
  outlined: 'bg-fill-normal border-line-normal text-label-netural border',
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  s: 'text-label-14sb h-9 rounded-md px-4',
  m: 'text-label-14sb h-10 rounded-lg px-5',
  l: 'text-body-16sb h-11 rounded-lg px-6',
  xl: 'text-body-16sb h-12 rounded-lg px-6',
}

// outlined는 Figma에서 사이즈와 무관하게 radius 8px + 아이콘 쪽(왼쪽) 패딩이 좁은 비대칭 패딩을 쓴다.
const OUTLINED_PADDING: Record<ButtonSize, string> = {
  s: 'rounded-lg py-2 pr-4 pl-3',
  m: 'rounded-lg py-2 pr-4 pl-3',
  l: 'rounded-lg py-2 pr-5 pl-[18px]',
  xl: 'rounded-lg py-2 pr-5 pl-[18px]',
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
      className={cn(
        'flex items-center justify-center gap-1 text-center transition-colors',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        // size=m의 strong만 Figma에서 8px 16px로, 같은 size의 다른 variant(8px 20px)보다 좁다.
        size === 'm' && variant === 'strong' && 'px-4',
        variant === 'outlined' && OUTLINED_PADDING[size],
        variant === 'disable' && 'cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
