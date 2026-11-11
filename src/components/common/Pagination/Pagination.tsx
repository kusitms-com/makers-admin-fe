import { cn } from '@lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const SIBLING_COUNT = 2
// 처음·끝·현재 ±SIBLING_COUNT·말줄임 2칸. 항상 같은 칸 수라 페이지를 넘겨도 너비가 흔들리지 않는다.
const MAX_ITEMS = SIBLING_COUNT * 2 + 5

type PageItem = number | 'start-ellipsis' | 'end-ellipsis'

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= MAX_ITEMS) return range(1, totalPages)

  const start = Math.min(Math.max(page - SIBLING_COUNT, 3), totalPages - SIBLING_COUNT * 2 - 2)
  const end = start + SIBLING_COUNT * 2

  return [
    1,
    start === 3 ? 2 : 'start-ellipsis',
    ...range(start, end),
    end === totalPages - 2 ? totalPages - 1 : 'end-ellipsis',
    totalPages,
  ]
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
        className="text-label-14sb text-label-alternative bg-fill-normal border-line-normal flex size-[30px] items-center justify-center rounded-md border disabled:opacity-50"
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
