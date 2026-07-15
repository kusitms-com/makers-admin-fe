import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@lib/utils'

interface MentoringSummaryCardProps {
  label: string
  count: number
  icon: ReactNode
  onClick?: () => void
  className?: string
}

export function MentoringSummaryCard({
  label,
  count,
  icon,
  onClick,
  className,
}: MentoringSummaryCardProps) {
  const content = (
    <div className="flex w-full flex-1 flex-col gap-9">
      <div className="flex h-5 items-center justify-between">
        <p className="text-label-14sb text-label-alternative">{label}</p>
        {onClick && (
          <ChevronRight className="text-label-alternative size-4 shrink-0" aria-hidden="true" />
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-pc-36b text-label-normal">{count}</p>
        <div className="size-[58px] shrink-0" aria-hidden="true">
          {icon}
        </div>
      </div>
    </div>
  )

  const baseClassName = cn(
    'border-line-neutral bg-fill-normal flex w-full items-start rounded-2xl border px-6 py-6',
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(baseClassName, 'text-left')}>
        {content}
      </button>
    )
  }

  return <div className={baseClassName}>{content}</div>
}
