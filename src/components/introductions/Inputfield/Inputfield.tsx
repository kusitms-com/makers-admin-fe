import type { InputHTMLAttributes } from 'react'
import { cn } from '@lib/utils'

interface InputfieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function Inputfield({ className, ...props }: InputfieldProps) {
  return (
    <div
      className={cn(
        'bg-fill-netural border-line-normal flex h-10 items-center rounded-lg border px-3 py-1.5',
        className,
      )}
    >
      <input
        className="text-label-14m text-label-normal placeholder:text-label-assitive w-full bg-transparent outline-none"
        {...props}
      />
    </div>
  )
}
