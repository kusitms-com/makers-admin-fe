import { cn } from '@lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className={cn('flex items-center gap-2', className)} aria-label="페이지네이션">
      <button
        type="button"
        onClick={() => {
          onPageChange(page - 1)
        }}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className="text-label-14sb text-label-alternative bg-fill-normal border-line-normal flex size-[30px] items-center justify-center rounded-md border disabled:opacity-50"
      >
        ‹
      </button>
      {pages.map((pageNumber) => {
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
              'text-label-13sb flex size-[30px] items-center justify-center rounded-md border p-px',
              isActive
                ? 'bg-brand-primary border-brand-primary text-fill-normal'
                : 'bg-fill-normal border-line-normal text-label-alternative',
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
        className="text-label-14sb text-label-alternative bg-fill-normal border-line-normal flex size-[30px] items-center justify-center rounded-md border disabled:opacity-50"
      >
        ›
      </button>
    </nav>
  )
}
