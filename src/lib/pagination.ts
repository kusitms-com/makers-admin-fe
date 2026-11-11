const SIBLING_COUNT = 2
// 처음·끝·현재 ±SIBLING_COUNT·말줄임 2칸. 항상 같은 칸 수라 페이지를 넘겨도 너비가 흔들리지 않는다.
const MAX_ITEMS = SIBLING_COUNT * 2 + 5

export type PageItem = number | 'start-ellipsis' | 'end-ellipsis'

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function getPageItems(page: number, totalPages: number): PageItem[] {
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
