export const LINK_FORMAT_ERROR = '링크 형식을 확인해주세요.'

// 홈페이지에서 그대로 링크로 여는 값이라 http(s) 주소만 허용한다. 'abc' 같은 값은 깨진 링크가 된다.
export function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value.trim())
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

// 선택 입력 링크: 비어 있으면 통과, 값이 있으면 http(s) 주소여야 한다.
export function linkError(value: string) {
  return value.trim() && !isHttpUrl(value) ? LINK_FORMAT_ERROR : undefined
}
