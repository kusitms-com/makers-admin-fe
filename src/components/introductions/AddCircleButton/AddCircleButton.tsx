import type { ButtonHTMLAttributes } from 'react'
import AddIcon from '@/assets/icons/generated/AddIcon'
import { cn } from '@lib/utils'

interface AddCircleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  'aria-label': string
  className?: string
}

export function AddCircleButton({ className, ...props }: AddCircleButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'bg-fill-primary text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:brightness-95',
        className,
      )}
      {...props}
    >
      <AddIcon className="size-4" aria-hidden="true" />
    </button>
  )
}
