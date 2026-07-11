import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@lib/utils'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function TextareaField({ className, ...props }: TextareaFieldProps) {
  return (
    <div
      className={cn(
        'bg-fill-netural border-line-normal flex h-[90px] w-full rounded-lg border px-3 py-2.5',
        className,
      )}
    >
      <textarea
        className="text-label-14m text-label-normal placeholder:text-label-assitive h-full w-full resize-none bg-transparent outline-none"
        {...props}
      />
    </div>
  )
}
