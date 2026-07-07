import type { VariantProps } from 'tailwind-variants'
import { tv } from '@lib/tv'

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

const PART_LABELS: Record<PartBadgeType, string> = {
  PLAN: '기획',
  DE: '디자인',
  FE: '프론트엔드',
  BE: '백엔드',
}

interface PartBadgeProps {
  part: PartBadgeType
  className?: string
}

export function PartBadge({ part, className }: PartBadgeProps) {
  return <span className={partBadgeVariants({ part, className })}>{PART_LABELS[part]}</span>
}
