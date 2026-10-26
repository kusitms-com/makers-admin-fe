# 어드민 프로젝트 API Reference

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

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
- `getMeetupProjects`/`getCorporateProjects`는 목록 조회(`findAll...`)라서 row가 0개여도 500 없이 빈 리스트를 반환합니다 — introductions처럼 초기 데이터를 POST로 먼저 만들어둘 필요가 없습니다. 백엔드 소스(`AdminService`)로 확인했습니다(2026-10-26).
- `planner`/`designer`/`frontend`/`backend`/`ios`/`aos`는 `List<String>`이라 introductions의 `teams`/`activities`와 달리 인덱스 표기가 필요 없습니다 — 같은 필드명을 항목 수만큼 반복해서 보내면 됩니다.
- `MeetupRequest.logoFile`/`posterFile`은 `AdminService#saveMeetup`에서 null 체크 없이 바로 업로드를 시도합니다. **POST에서는 둘 다 필수**이며 생략하면 500이 납니다(PUT의 `updateMeetup`은 `uploadOrKeep`를 써서 생략 시 기존 값을 유지하므로 선택입니다).
- `type`은 `ProjectType` enum(`APP`/`WEB`/`CHROME_EXTENSION`)입니다. 커스텀 컨버터가 없어 Spring 기본 enum 바인딩(대소문자 구분, 상수명과 정확히 일치)을 그대로 씁니다 — `app`/`Web` 같은 값은 바인딩 실패로 400이 납니다.
- `startDate`/`endDate`는 `LocalDate.parse(..., DateTimeFormatter.ISO_DATE)`로 파싱되므로 `yyyy-MM-dd` 형식이어야 합니다. 형식이 틀리면 500이 납니다.
- `getMeetupProjects`(목록)는 `isDetail=false`로 `MeetupDetailResponse`를 만들어서(`new MeetupDetailResponse(p, false)`) `intro`/`type`/`start_date`/`end_date`/`team` 필드가 `@JsonInclude(NON_NULL)`이라 응답에 아예 포함되지 않습니다. 상세 조회(`getMeetupProject`, `isDetail=true`)에서만 내려옵니다.
- `getCorporateProjects_1`(`GET /admin/corporate`)의 `CorporateDetailResponse`도 `category`(과제 분류)와 `tags`(태그)를 별도 필드로 내려줍니다. `CorporateRequest`의 `tag`(요청, 단수)와 이름이 다르고, `category`는 request 쪽에 대응 필드가 없습니다 — 실제 값도 `["33"]`처럼 cardinal을 그대로 담거나 `[""]`처럼 비어 있어서 현재는 신뢰할 수 있는 입력값이 아닙니다.
- `logo_url`/`banner_url`도 밋업과 동일하게 버킷 도메인과 key 사이 슬래시가 빠져 있습니다(2026-10-26, 실제 응답으로 확인). `toAbsoluteS3Url()`로 정규화해야 합니다.
- **`logo_url`/`poster_url`/`web_thumbnail_url`이 완전한 URL이 아닙니다.** `MeetupDetailResponse`가 `s3Url + meetup.getPosterUrl()`로 문자열만 이어붙여서, 버킷 도메인과 key 사이에 슬래시가 빠진 `https://kusitms-bucket.s3.ap-northeast-2.amazonaws.commeetup/...` 형태로 내려옵니다. `src/lib/s3.ts`의 `toAbsoluteS3Url()`로 정규화해서 써야 합니다. 자세한 내용은 `.claude/known-issues/records/api-meetup-image-url-missing-slash.md` 참고.

## Response Fields (`GET /admin/meetup`, `MeetupResponse`) — 확정됨

```
{
  "meetup_count": number,
  "meetup_list": [
    {
      "meetup_id": number,
      "cardinal": number,
      "name": string,
      "one_line_intro": string,
      "logo_url": string | null,
      "poster_url": string | null,
      "web_thumbnail_url": string | null,
      "behance_url": string | null,
      "instagram_url": string | null,
      "github_url": string | null,
      "app_url": string | null,
      "tags": string[] | null
    }
  ]
}
```

## Response Fields (`GET /admin/corporate`, `CorporateResponse`) — 확정됨

```
{
  "corporateCount": number,
  "corporateList": [
    {
      "corporate_id": number,
      "cardinal": number,
      "name": string,
      "content": string,
      "category": string[],
      "logo_url": string | null,
      "banner_url": string | null,
      "tags": string[] | null
    }
  ]
}
```

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
