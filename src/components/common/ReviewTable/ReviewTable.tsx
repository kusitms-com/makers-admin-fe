import { cn } from '@lib/utils'
import { ReviewTableRow } from '../ReviewTableRow/ReviewTableRow'
import { TableFooter } from '../TableFooter/TableFooter'
import type { PartBadgeType } from '../PartBadge/PartBadge'

interface ReviewTableRowData {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  title: string
  category?: string
  phone?: string
  fileName?: string
}

interface ReviewTableProps {
  type: 'blogReview' | 'memberReview'
  rows: ReviewTableRowData[]
  onDeleteRow?: (id: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalLabel: string
  emptyMessage?: string
  className?: string
}

const BLOG_REVIEW_COLUMNS = [
  { label: '이름', className: 'w-[74px]' },
  { label: '기수', className: 'w-[90px]' },
  { label: '파트', className: 'w-[100px]' },
  { label: '활동', className: 'w-[90px]' },
  { label: '제목', className: 'min-w-px flex-1 pl-3' },
] as const

const MEMBER_REVIEW_COLUMNS = [
  { label: '이름', className: 'w-[84px] items-center' },
  { label: '첨부파일', className: 'w-[161px] items-center px-3' },
  { label: '기수', className: 'w-[90px] px-3' },
  { label: '파트', className: 'w-[100px]' },
  { label: '전화번호', className: 'w-[140px]' },
  { label: '제목', className: 'min-w-px flex-1' },
] as const

export function ReviewTable({
  type,
  rows,
  onDeleteRow,
  page,
  totalPages,
  onPageChange,
  totalLabel,
  emptyMessage = '표시할 후기가 없습니다.',
  className,
}: ReviewTableProps) {
  const isMemberReview = type === 'memberReview'
  const columns = isMemberReview ? MEMBER_REVIEW_COLUMNS : BLOG_REVIEW_COLUMNS

  return (
    <div
      className={cn(
        'bg-fill-normal border-line-alternative w-full overflow-hidden rounded-xl border',
        className,
      )}
    >
      <div
        className={cn('bg-fill-netural flex h-12 w-full items-start', !isMemberReview && 'gap-1')}
      >
        {columns.map((column) => (
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

      {rows.length > 0 ? (
        <div className="flex w-full flex-col items-start">
          {rows.map((row) => (
            <ReviewTableRow
              key={row.id}
              type={type}
              name={row.name}
              generation={row.generation}
              part={row.part}
              category={row.category}
              phone={row.phone}
              fileName={row.fileName}
              title={row.title}
              onDelete={() => onDeleteRow?.(row.id)}
              className="w-full"
            />
          ))}
        </div>
      ) : (
        <div className="text-label-14m text-label-alternative flex h-16 w-full items-center justify-center">
          {emptyMessage}
        </div>
      )}

      <TableFooter
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalLabel={totalLabel}
      />
    </div>
  )
}
