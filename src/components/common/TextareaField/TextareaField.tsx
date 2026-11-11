import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@lib/utils'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function TextareaField({ className, ...props }: TextareaFieldProps) {
  // Inputfield와 같은 규칙: 포커스되면 파란 테두리와 흰 배경, 값이 있으면 흰 배경 유지
  const hasValue = props.value != null && String(props.value).length > 0

  return (
    <div
      className={cn(
        'border-line-normal focus-within:border-brand-primary focus-within:bg-fill-normal flex h-[90px] w-full rounded-lg border px-3 py-2.5',
        hasValue ? 'bg-fill-normal' : 'bg-fill-netural',
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
