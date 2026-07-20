import type { VariantProps } from 'tailwind-variants'
import { tv } from '@lib/tv'
import { PART_LABELS } from './partLabels'

const partBadgeVariants = tv({
  base: 'text-caption-12sb flex h-7 items-center justify-center rounded-md border px-[9px] py-[5px]',
  variants: {
    part: {
      PLAN: 'bg-orange-10 border-orange-30 text-orange-80',
      DE: 'bg-indigo-5 border-indigo-30 text-indigo-70',
      FE: 'bg-sky-blue-5 border-sky-blue-30 text-sky-blue-70',
      BE: 'bg-green-5 border-green-40 text-green-70',
    },
  },
})

type PartBadgeVariants = VariantProps<typeof partBadgeVariants>
export type PartBadgeType = NonNullable<PartBadgeVariants['part']>

interface PartBadgeProps {
  part: PartBadgeType
  className?: string
}

export function PartBadge({ part, className }: PartBadgeProps) {
  return <span className={partBadgeVariants({ part, className })}>{PART_LABELS[part]}</span>
}
