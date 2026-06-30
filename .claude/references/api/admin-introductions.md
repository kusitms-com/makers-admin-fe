# 어드민 학회 소개 API Reference

Swagger 출처: `https://kusitms.herokuapp.com/api-docs/json`

학회 소개 페이지의 관리자 조회/수정에는 이 파일을 사용합니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/introductions` | `getIntroduction_1` | 없음 | `BaseResponseObject` |
| `PUT` | `/admin/introductions` | `updateIntroduction` | `IntroRequest` multipart | `BaseResponseObject` |

## 구현 메모

- API 함수는 `src/api/introductions.ts`에 둡니다.
- query key는 `['admin', 'introductions']`를 우선합니다.
- 수정은 `multipart/form-data`입니다.
- 수정 이후 소개 조회 query를 invalidate합니다.

## Request Fields

### `IntroRequest`

| Field | Type |
| --- | --- |
| `bannerCardinal` | `number` |
| `bannerStatus` | `string` |
| `slogan` | `string` |
| `bannerImageFile` | `File` |
| `memberCount` | `number` |
| `projectCount` | `number` |
| `universityCount` | `number` |
| `introYoutubeLink` | `string` |
| `planningImage` | `File` |
| `designImage` | `File` |
| `frontendImage` | `File` |
| `backendImage` | `File` |
| `teams` | `ManagementTeamRequest[]` |
| `expertLecture` | `ExpertLectureRequest[]` |
| `obLecture` | `OBLectureRequest[]` |
| `partnerLogoFiles` | `string[]` 또는 파일 배열, Swagger schema 재확인 필요 |
| `meetupImages` | `string[]` 또는 파일 배열, Swagger schema 재확인 필요 |
| `activities` | `ActivityRequest[]` |
| `sponsors` | `string[]` 또는 파일 배열, Swagger schema 재확인 필요 |
