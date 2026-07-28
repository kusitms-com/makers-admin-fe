import CancelIcon from '@/assets/icons/generated/CancelIcon'
import { cn } from '@lib/utils'
import { CohortBadge } from '../CohortBadge/CohortBadge'
import { FileChip } from '../FileChip/FileChip'
import { PartBadge, type PartBadgeType } from '../PartBadge/PartBadge'

interface ReviewTableRowProps {
  type: 'blogReview' | 'memberReview'
  name: string
  generation: number
  part: PartBadgeType
  title: string
  link?: string
  category?: string
  phone?: string
  fileName?: string
  onDelete?: () => void
  className?: string
}

function Label({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('text-label-14m text-label-normal whitespace-nowrap', className)}>
      {children}
    </span>
  )
}

export function ReviewTableRow({
  type,
  name,
  generation,
  part,
  title,
  link,
  category,
  phone,
  fileName,
  onDelete,
  className,
}: ReviewTableRowProps) {
  const isMemberReview = type === 'memberReview'
  const extraLabel = isMemberReview ? phone : category

  return (
    <div className={cn('flex h-16 items-center', isMemberReview ? 'gap-2' : 'gap-1', className)}>
      <div className={cn('flex h-full min-w-px flex-1 items-center', !isMemberReview && 'gap-1')}>
        <div
          className={cn(
            'flex h-full shrink-0 flex-col justify-center px-[18px] py-5',
            isMemberReview ? 'w-[84px] items-center' : 'w-[74px] items-start',
          )}
        >
          <Label>{name}</Label>
        </div>

        {isMemberReview && (
          <div className="flex h-full w-[161px] shrink-0 flex-col items-center justify-center px-3">
            {fileName && <FileChip fileName={fileName} className="w-full" />}
          </div>
        )}

        <div
          className={cn(
            'flex h-full w-[90px] shrink-0 flex-col items-start justify-center py-[14.5px]',
            isMemberReview ? 'px-3' : 'pl-[18px]',
          )}
        >
          <CohortBadge generation={generation} />
        </div>

        <div
          className={cn(
            'flex h-full w-[100px] shrink-0 flex-col items-start justify-center py-[21px] pl-[18px]',
            isMemberReview && 'pr-[18px]',
          )}
        >
          <PartBadge part={part} />
        </div>

        <div
          className={cn(
            'flex h-full shrink-0 flex-col items-start justify-center py-[21px]',
            isMemberReview ? 'w-[140px] px-[18px]' : 'w-[90px] pr-9 pl-[18px]',
          )}
        >
          {extraLabel && <Label>{extraLabel}</Label>}
        </div>

        <div
          className={cn(
            'flex h-full min-w-px flex-1 flex-col items-start justify-center overflow-hidden pb-px',
            isMemberReview ? 'px-[18px]' : 'pl-3',
          )}
        >
          {isMemberReview || !link ? (
            <Label className="w-full truncate">{title}</Label>
          ) : (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-label-14m text-label-normal w-full truncate hover:underline"
            >
              {title}
            </a>
          )}
        </div>
      </div>

      <div className="flex h-full shrink-0 items-center py-5 pr-[18px]">
        <button
          type="button"
          onClick={onDelete}
          aria-label="삭제"
          className="bg-fill-netural border-line-neutral flex size-[26px] cursor-pointer items-center justify-center rounded-full border"
        >
          <CancelIcon className="text-label-alternative size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
