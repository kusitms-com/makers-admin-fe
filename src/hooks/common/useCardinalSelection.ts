import { useState } from 'react'
import { useCurrentCardinalQuery } from '@api/auth/queries'
import { toCohortOptions } from '@lib/cohort'

// 등록 모달의 기수 선택. 기본값은 현재 기수이고, 기존 데이터에 있는 기수와 현재 기수 중에서 고른다.
export function useCardinalSelection(existingCardinals: number[]) {
  const currentCardinal = useCurrentCardinalQuery().data
  const [pickedCardinal, setPickedCardinal] = useState<number | null>(null)

  return {
    cardinal: pickedCardinal ?? currentCardinal,
    options: toCohortOptions(existingCardinals, currentCardinal),
    setCardinal: setPickedCardinal,
    // 모달을 새로 열 때 현재 기수로 되돌린다.
    reset: () => {
      setPickedCardinal(null)
    },
  }
}
