import type { ReactNode } from 'react'
import { cn } from '@lib/utils'

interface FormFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-label-13b text-label-normal">{label}</span>
      {children}
    </div>
  )
}
