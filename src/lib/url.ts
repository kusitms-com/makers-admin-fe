export const LINK_FORMAT_ERROR = '링크 형식을 확인해주세요.'

// 홈페이지에서 그대로 링크로 여는 값이라 http(s) 주소만 허용한다. 'abc' 같은 값은 깨진 링크가 된다.
// 'https:example.com'처럼 '//'가 빠진 값은 URL 파싱은 통과하지만 <a href>에서 상대 경로가 되므로 접두어까지 확인한다.
export function isHttpUrl(value: string) {
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return false
  try {
    new URL(trimmed)
    return true
  } catch {
    return false
  }
}

// 선택 입력 링크: 비어 있으면 통과, 값이 있으면 http(s) 주소여야 한다.
export function linkError(value: string) {
  return value.trim() && !isHttpUrl(value) ? LINK_FORMAT_ERROR : undefined
}
