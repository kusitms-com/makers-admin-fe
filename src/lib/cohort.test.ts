import { describe, expect, it } from 'vitest'
import { toCohortOptions } from './cohort'

describe('toCohortOptions', () => {
  it('데이터의 기수와 현재 기수를 중복 없이 최신순으로 만든다', () => {
    expect(toCohortOptions([33, 31, 33, 34], 34).map((option) => option.label)).toEqual([
      '34기',
      '33기',
      '31기',
    ])
  })

  it('현재 기수 데이터가 아직 없어도 현재 기수 탭을 만든다', () => {
    expect(toCohortOptions([33], 34).map((option) => option.value)).toEqual(['34', '33'])
  })

  it('현재 기수를 모르면 데이터의 기수만 쓴다', () => {
    expect(toCohortOptions([32, 33])).toEqual([
      { value: '33', label: '33기' },
      { value: '32', label: '32기' },
    ])
  })
})
