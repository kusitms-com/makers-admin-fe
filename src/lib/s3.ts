// ponytail: 백엔드가 이미지 URL 필드를 완전한 URL로 내려주지 않는 두 가지 버그가 있다.
// - introductions: S3 object key만 내려준다(`intro/{uuid}{파일명}`).
// - projects/meetup: 버킷 도메인과 key를 슬래시 없이 그냥 이어붙인다
//   (`MeetupDetailResponse`가 `s3Url + meetup.getPosterUrl()`로 문자열 연결만 한다).
// 버킷 도메인을 하드코딩해서 두 경우 모두 정규화한다. 백엔드가 완전한 URL을 반환하도록 고치면 제거한다.
// 관련 known-issue: .claude/known-issues/records/api-introductions-image-url-not-absolute.md
const S3_BASE_URL = 'https://kusitms-bucket.s3.ap-northeast-2.amazonaws.com'

export function toAbsoluteS3Url(value: string | null | undefined): string | undefined {
  if (!value) return undefined

  const key = value.startsWith(S3_BASE_URL) ? value.slice(S3_BASE_URL.length) : value
  const encodedKey = key.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')

  return `${S3_BASE_URL}/${encodedKey}`
}
