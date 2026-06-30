# 어드민 프로젝트 API Reference

Swagger 출처: `https://kusitms.herokuapp.com/api-docs/json`

관리자 프로젝트 조회와 등록/수정/삭제에는 이 파일을 사용합니다.

## Meetup Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/meetup` | `getMeetupProjects_1` | 없음 | `BaseResponseObject` |
| `GET` | `/admin/meetup/{meetup_id}` | `getMeetupProject_1` | path: `meetup_id` | `BaseResponseObject` |
| `POST` | `/admin/projects/meetup` | `addMeetupProject` | `MeetupRequest` multipart | `BaseResponseObject` |
| `PUT` | `/admin/projects/meetup` | `updateMeetupProject` | `MeetupRequest` multipart | `BaseResponseObject` |
| `DELETE` | `/admin/projects/meetup/{id}` | `deleteMeetupProject` | path: `id` | `BaseResponseObject` |

## Corporate Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/corporate` | `getCorporateProjects_1` | 없음 | `BaseResponseObject` |
| `GET` | `/admin/corporate/{id}` | `getCorporateProject` | path: `id` | `BaseResponseObject` |
| `POST` | `/admin/projects/corporate` | `addCorporateProject` | `CorporateRequest` multipart | `BaseResponseObject` |
| `PUT` | `/admin/projects/corporate` | `updateCorporateProject` | `CorporateRequest` multipart | `BaseResponseObject` |
| `DELETE` | `/admin/projects/corporate/{id}` | `deleteCorporateProject` | path: `id` | `BaseResponseObject` |

## 구현 메모

- API 함수는 `src/api/projects.ts`에 둡니다.
- query key는 `['admin', 'projects', 'meetup']`, `['admin', 'projects', 'corporate']`를 우선합니다.
- 등록/수정은 `multipart/form-data`입니다.
- 등록/수정/삭제 이후 관련 list/detail query를 invalidate합니다.
- `meetup_id`와 `id` path parameter 이름이 다르므로 API 함수에서 명확히 구분합니다.

## Request Fields

### `MeetupRequest`

| Field | Type |
| --- | --- |
| `meetupId` | `number` |
| `cardinal` | `number` |
| `name` | `string` |
| `intro` | `string` |
| `type` | `string` |
| `oneLineIntro` | `string` |
| `instagramUrl` | `string` |
| `githubUrl` | `string` |
| `appUrl` | `string` |
| `behanceUrl` | `string` |
| `startDate` | `string` |
| `endDate` | `string` |
| `teamName` | `string` |
| `planner` | `string[]` |
| `designer` | `string[]` |
| `frontend` | `string[]` |
| `backend` | `string[]` |
| `ios` | `string[]` |
| `aos` | `string[]` |
| `logoFile` | `File` |
| `posterFile` | `File` |

### `CorporateRequest`

| Field | Type |
| --- | --- |
| `corporateId` | `number` |
| `cardinal` | `number` |
| `name` | `string` |
| `content` | `string` |
| `tag` | `string[]` |
| `logoFile` | `File` |
| `bannerFile` | `File` |
