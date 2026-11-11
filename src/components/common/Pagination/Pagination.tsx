import { getPageItems } from '@lib/pagination'
import { cn } from '@lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = getPageItems(page, totalPages)

  return (
    <nav className={cn('flex items-center gap-2', className)} aria-label="페이지네이션">
      <button
        type="button"
        onClick={() => {
          onPageChange(page - 1)
        }}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className="text-label-14sb text-label-alternative bg-fill-normal border-line-normal enabled:hover:text-label-normal flex size-[30px] items-center justify-center rounded-md border enabled:cursor-pointer disabled:opacity-50"
      >
        ‹
      </button>
      {pages.map((pageNumber) => {
        if (typeof pageNumber !== 'number') {
          return (
            <span
              key={pageNumber}
              aria-hidden="true"
              className="text-label-13sb text-label-alternative flex size-[30px] items-center justify-center"
            >
              …
            </span>
          )
        }

        const isActive = pageNumber === page

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => {
              onPageChange(pageNumber)
            }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'text-label-13sb flex size-[30px] cursor-pointer items-center justify-center rounded-md border p-px',
              isActive
                ? 'bg-brand-primary border-brand-primary text-fill-normal'
                : 'bg-fill-normal border-line-normal text-label-alternative hover:text-label-normal',
            )}
          >
            {pageNumber}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => {
          onPageChange(page + 1)
        }}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        className="text-label-14sb text-label-alternative bg-fill-normal border-line-normal enabled:hover:text-label-normal flex size-[30px] items-center justify-center rounded-md border enabled:cursor-pointer disabled:opacity-50"
      >
        ›
      </button>
    </nav>
  )
}
