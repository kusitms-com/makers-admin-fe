import ErrorIcon from '@/assets/icons/generated/ErrorIcon'
import { cn } from '@lib/utils'

interface ErrorFallbackProps {
  title: string
  description?: string
  className?: string
}

export function ErrorFallback({ title, description, className }: ErrorFallbackProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <ErrorIcon className="text-red-60 size-10" aria-hidden="true" />
      <p className="text-headline-20b text-label-normal">{title}</p>
      {description && <p className="text-label-14r text-label-alternative">{description}</p>}
    </div>
  )
}
