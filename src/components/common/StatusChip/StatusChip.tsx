import type { VariantProps } from 'tailwind-variants'
import { tv } from '@lib/tv'

const statusChipVariants = tv({
  base: 'text-label-14sb flex items-center gap-1.5 rounded-full py-1 pr-3.5 pl-3',
  variants: {
    status: {
      progress: 'bg-fill-primary text-brand-primary',
      waiting: 'bg-fill-positive text-green-60',
      completed: 'bg-fill-alternative text-label-light',
    },
  },
})

const dotVariants = tv({
  base: 'size-1.5 shrink-0 rounded-full',
  variants: {
    status: {
      progress: 'bg-brand-primary',
      waiting: 'bg-green-60',
      completed: 'bg-label-light',
    },
  },
})

type StatusChipVariants = VariantProps<typeof statusChipVariants>
export type StatusChipStatus = NonNullable<StatusChipVariants['status']>

const STATUS_LABELS: Record<StatusChipStatus, string> = {
  progress: '진행중',
  waiting: '대기중',
  completed: '완료',
}

interface StatusChipProps {
  status: StatusChipStatus
  className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span className={statusChipVariants({ status, className })}>
      <span className={dotVariants({ status })} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
