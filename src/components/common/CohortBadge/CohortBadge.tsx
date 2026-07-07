import { cn } from '@lib/utils'

interface CohortBadgeProps {
  generation: number
  className?: string
}

export function CohortBadge({ generation, className }: CohortBadgeProps) {
  return (
    <span
      className={cn(
        'bg-fill-netural text-label-13m text-label-normal flex h-7 w-fit items-center justify-center rounded-full px-3 py-1',
        className,
      )}
    >
      {generation}기
    </span>
  )
}
