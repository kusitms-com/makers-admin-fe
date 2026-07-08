import type { VariantProps } from 'tailwind-variants'
import { tv } from '@lib/tv'

const statusChip = tv({
  slots: {
    base: 'text-label-14sb flex items-center gap-1.5 rounded-full py-1 pr-3.5 pl-3',
    dot: 'size-1.5 shrink-0 rounded-full',
  },
  variants: {
    status: {
      progress: { base: 'bg-fill-primary text-brand-primary', dot: 'bg-brand-primary' },
      waiting: { base: 'bg-fill-positive text-green-60', dot: 'bg-green-60' },
      completed: { base: 'bg-fill-alternative text-label-light', dot: 'bg-label-light' },
    },
  },
})

type StatusChipVariants = VariantProps<typeof statusChip>
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
  const { base, dot } = statusChip({ status })

  return (
    <span className={base({ className })}>
      <span className={dot()} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
