import type { ReactNode } from 'react'
import { cn } from '@lib/utils'

interface IntroductionSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function IntroductionSection({ title, children, className }: IntroductionSectionProps) {
  return (
    <section
      className={cn('border-line-neutral flex flex-col rounded-2xl border bg-white', className)}
    >
      <div className="border-line-alternative border-b px-6 py-4">
        <h2 className="text-body-18b text-label-normal">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 px-6 pt-5 pb-6">{children}</div>
    </section>
  )
}
