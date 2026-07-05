import type { ReactNode } from 'react'
import { cn } from '@lib/utils'
import { Button } from '../Button'

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
        'border-line-neutral flex h-[84px] items-center justify-between border-b px-6 pb-1',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-headline-20b text-label-normal">{title}</h1>
        {children}
      </div>
      {actionLabel && (
        <Button variant="strong" size="m" onClick={onAction} className="hover:brightness-95">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
