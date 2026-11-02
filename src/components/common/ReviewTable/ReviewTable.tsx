import { cn } from '@lib/utils'
import { ReviewTableRow } from '../ReviewTableRow/ReviewTableRow'
import { TableFooter } from '../TableFooter/TableFooter'
import type { PartBadgeType } from '../PartBadge/PartBadge'

interface ReviewTableRowData {
  id: string
  name: string
  generation: number
  part?: PartBadgeType
  team?: string
  title: string
  link?: string
  category?: string
  phone?: string
  fileName?: string
}

interface ReviewTableProps {
  type: 'blogReview' | 'memberReview' | 'review'
  rows: ReviewTableRowData[]
  onEditRow?: (id: string) => void
  onDeleteRow?: (id: string) => void
  onTitleClick?: (id: string) => void
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

const REVIEW_COLUMNS = [
  { label: '이름', className: 'w-[74px]' },
  { label: '기수', className: 'w-[90px]' },
  { label: '소속팀', className: 'w-[100px]' },
  { label: '후기', className: 'min-w-px flex-1 pl-3' },
] as const

export function ReviewTable({
  type,
  rows,
  onEditRow,
  onDeleteRow,
  onTitleClick,
  page,
  totalPages,
  onPageChange,
  totalLabel,
  emptyMessage = '표시할 후기가 없습니다.',
  className,
}: ReviewTableProps) {
  const isMemberReview = type === 'memberReview'
  const columns =
    type === 'review'
      ? REVIEW_COLUMNS
      : isMemberReview
        ? MEMBER_REVIEW_COLUMNS
        : BLOG_REVIEW_COLUMNS

  return (
    <div
      className={cn(
        "bg-fill-normal relative w-full overflow-hidden rounded-xl after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:shadow-[inset_0_0_0_1px_var(--line-alternative)] after:content-['']",
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
              team={row.team}
              category={row.category}
              phone={row.phone}
              fileName={row.fileName}
              title={row.title}
              link={row.link}
              onEdit={
                onEditRow
                  ? () => {
                      onEditRow(row.id)
                    }
                  : undefined
              }
              onDelete={() => onDeleteRow?.(row.id)}
              onTitleClick={
                onTitleClick
                  ? () => {
                      onTitleClick(row.id)
                    }
                  : undefined
              }
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
