import type { ReactNode } from 'react'
import { cn } from '@lib/utils'

interface PageHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, actionLabel, onAction, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-[84px] items-center justify-between border-b border-[rgba(112,115,124,0.16)] px-6 pb-1',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-headline-20b text-label-normal">{title}</h1>
        {children}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="bg-brand-primary text-label-14sb text-fill-normal h-10 rounded-[8px] px-4 py-2 transition-colors hover:brightness-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
