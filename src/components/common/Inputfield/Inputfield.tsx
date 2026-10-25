import type { ComponentPropsWithRef } from 'react'
import { cn } from '@lib/utils'

interface InputfieldProps extends ComponentPropsWithRef<'input'> {
  className?: string
}

export function Inputfield({ className, ref, ...props }: InputfieldProps) {
  const hasValue = props.value != null && String(props.value).length > 0

  return (
    <div
      className={cn(
        'border-line-normal focus-within:border-brand-primary focus-within:bg-fill-normal flex h-10 items-center rounded-lg border px-3 py-1.5',
        hasValue ? 'bg-fill-normal' : 'bg-fill-netural',
        className,
      )}
    >
      <input
        ref={ref}
        className="text-label-14m text-label-strong placeholder:text-label-assitive w-full bg-transparent outline-none"
        {...props}
      />
    </div>
  )
}
