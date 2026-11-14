import { describe, expect, it } from 'vitest'
import { isHttpUrl, LINK_FORMAT_ERROR, linkError } from './url'

describe('isHttpUrl', () => {
  it('http(s) 주소만 허용한다', () => {
    expect(isHttpUrl('https://github.com/kusitms')).toBe(true)
    expect(isHttpUrl(' http://blog.naver.com/a ')).toBe(true)
    expect(isHttpUrl('abc')).toBe(false)
    expect(isHttpUrl('github.com/kusitms')).toBe(false)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
  })
})

describe('linkError', () => {
  it('비어 있으면 오류가 없고, 형식이 틀리면 안내 문구를 돌려준다', () => {
    expect(linkError('')).toBeUndefined()
    expect(linkError('   ')).toBeUndefined()
    expect(linkError('https://a.com')).toBeUndefined()
    expect(linkError('abc')).toBe(LINK_FORMAT_ERROR)
  })
})
