import { cloneElement, isValidElement, useId, type ReactNode } from 'react'
import { cn } from '@lib/utils'

interface FormFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  const fieldId = useId()
  const isElementChild = isValidElement<{ id?: string }>(children)
  const resolvedId = isElementChild ? (children.props.id ?? fieldId) : fieldId
  const field = isElementChild ? cloneElement(children, { id: resolvedId }) : children

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={resolvedId} className="text-label-13b text-label-normal">
        {label}
      </label>
      {field}
    </div>
  )
}
