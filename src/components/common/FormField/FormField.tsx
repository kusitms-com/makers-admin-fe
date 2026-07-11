import { cloneElement, isValidElement, useId, type ReactNode } from 'react'
import { cn } from '@lib/utils'

interface FormFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  const fieldId = useId()
  const field = isValidElement<{ id?: string }>(children)
    ? cloneElement(children, { id: children.props.id ?? fieldId })
    : children

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={fieldId} className="text-label-13b text-label-normal">
        {label}
      </label>
      {field}
    </div>
  )
}
