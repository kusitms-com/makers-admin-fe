import { cn } from '@lib/utils'

interface TableFooterProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalLabel: string
  className?: string
}

export function TableFooter({
  page,
  totalPages,
  onPageChange,
  totalLabel,
  className,
}: TableFooterProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div
      className={cn(
        'bg-fill-netural border-line-alternative flex h-16 items-center justify-between border-t px-[18px] pt-[17px] pb-[18px]',
        className,
      )}
    >
      <nav className="flex items-center gap-1" aria-label="페이지네이션">
        <button
          type="button"
          onClick={() => {
            onPageChange(page - 1)
          }}
          disabled={page <= 1}
          aria-label="이전 페이지"
          className="text-label-14sb text-label-alternative flex size-[30px] items-center justify-center rounded-md disabled:opacity-50"
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
                'text-label-13sb flex size-[30px] items-center justify-center rounded-md',
                isActive
                  ? 'bg-fill-alternative text-label-normal'
                  : 'bg-fill-normal text-label-alternative',
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
          className="text-label-14sb text-label-alternative flex size-[30px] items-center justify-center rounded-md disabled:opacity-50"
        >
          ›
        </button>
      </nav>
      <span className="text-caption-12r text-label-assitive">{totalLabel}</span>
    </div>
  )
}
