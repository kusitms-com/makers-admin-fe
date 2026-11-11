// 목록 API가 전체 기수를 내려주므로, 데이터에 있는 기수와 현재 기수로 탭을 만든다. 최신 기수가 앞에 온다.
export function toCohortOptions(cardinals: number[], currentCardinal?: number) {
  const unique = new Set(
    currentCardinal === undefined ? cardinals : [...cardinals, currentCardinal],
  )

  return [...unique]
    .sort((a, b) => b - a)
    .map((cardinal) => ({ value: String(cardinal), label: `${String(cardinal)}기` }))
}
