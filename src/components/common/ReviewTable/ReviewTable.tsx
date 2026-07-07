import { cn } from '@lib/utils'
import { ReviewTableRow } from '../ReviewTableRow/ReviewTableRow'
import { TableFooter } from '../TableFooter/TableFooter'
import type { PartBadgeType } from '../PartBadge/PartBadge'

interface ReviewTableRowData {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  category: string
  title: string
}

interface ReviewTableProps {
  rows: ReviewTableRowData[]
  onDeleteRow?: (id: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalLabel: string
  className?: string
}

const COLUMNS = [
  { label: '이름', className: 'w-[74px]' },
  { label: '기수', className: 'w-[90px]' },
  { label: '파트', className: 'w-[100px]' },
  { label: '활동', className: 'w-[90px]' },
  { label: '제목', className: 'min-w-px flex-1 pl-3' },
] as const

export function ReviewTable({
  rows,
  onDeleteRow,
  page,
  totalPages,
  onPageChange,
  totalLabel,
  className,
}: ReviewTableProps) {
  return (
    <div
      className={cn(
        'bg-fill-normal border-line-alternative w-full overflow-hidden rounded-xl border',
        className,
      )}
    >
      <div className="bg-fill-netural flex h-12 w-full items-start gap-1">
        {COLUMNS.map((column) => (
          <div
            key={column.label}
            className={cn('flex shrink-0 flex-col items-start px-[18px] py-3.5', column.className)}
          >
            <span className="text-label-13sb text-label-alternative whitespace-nowrap">
              {column.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-start">
        {rows.map((row) => (
          <ReviewTableRow
            key={row.id}
            type="blogReview"
            name={row.name}
            generation={row.generation}
            part={row.part}
            category={row.category}
            title={row.title}
            onDelete={() => onDeleteRow?.(row.id)}
            className="w-full"
          />
        ))}
      </div>

      <TableFooter
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalLabel={totalLabel}
      />
    </div>
  )
}
