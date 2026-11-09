# 어드민 학회 소개 API Reference

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

학회 소개 페이지의 관리자 조회/수정에는 이 파일을 사용합니다.

아래 내용은 2026-11-09에 Swagger(`/api-docs/json`)의 `AdminIntroResponse`/`IntroRequest`/`ManagementTeamRequest`/`ActivityRequest`/`ExpertLectureRequest`/`OBLectureRequest`/`IntroImageRequest`/`IntroImageResponse` 스키마로 직접 재검증했습니다. 이전 버전 문서가 설명하던 계약(전체 교체 방식, `slogan`/`banner_image_url` 포함, `partner_logo_urls` 등 단순 `string[]`)은 백엔드가 깨는 변경(breaking change)을 내보내면서 더 이상 유효하지 않습니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/introductions` | `getIntroduction_1` | 없음 | `BaseResponseObject` (`data`: `AdminIntroResponse`) |
| `PUT` | `/admin/introductions` | `updateIntroduction` | `IntroRequest` multipart | `BaseResponseVoid` |

`POST /admin/introductions`(최초 데이터 생성용, `@Hidden`)는 이번 Swagger에는 노출되지 않았습니다. 이미 운영 DB에 데이터가 적재된 상태(2026-11 디스코드 공지 기준)라 현재는 GET/PUT만 사용합니다. 과거 500 이슈의 배경은 `.claude/known-issues/records/api-introductions-500.md` 참고.

## Request Fields (`IntroRequest`)

`bannerCardinal`/`bannerStatus`/`memberCount`/`projectCount`/`universityCount`/`introYoutubeLink`는 필수(Swagger `required`)이고, 나머지는 전부 선택입니다. **`slogan`, `bannerImageFile`는 API에서 제거되었습니다** — UI에도 입력란을 두지 않습니다.

| Field | Type |
| --- | --- |
| `bannerCardinal` | `number` (필수) |
| `bannerStatus` | `'CLOSE' \| 'MANAGE_RECRUIT' \| 'MEMBER_RECRUIT'` (필수) |
| `memberCount` / `projectCount` / `universityCount` | `number` (필수) |
| `introYoutubeLink` | `string` (필수) |
| `planningImage` / `designImage` / `frontendImage` / `backendImage` | `File` (선택, 생략 시 기존 값 유지) |
| `teams` | `ManagementTeamRequest[]` |
| `expertLecture` | `ExpertLectureRequest[]` |
| `obLecture` | `OBLectureRequest[]` |
| `activities` | `ActivityRequest[]` |
| `partnerLogos` | `IntroImageRequest[]` |
| `meetupImages` | `IntroImageRequest[]` |
| `sponsors` | `IntroImageRequest[]` |

### 목록 항목 스키마

- `ManagementTeamRequest`/`ExpertLectureRequest`/`OBLectureRequest`: `id?`, 내용 필드(`name`, `description`/`corporation`+`description`/`topic`), `imageFile?`, `removeImage?`
- `ActivityRequest`: `id?`, `name`, `description`, `imageFile1?`, `imageFile2?`, `removeImage1?`, `removeImage2?`
- `IntroImageRequest`(`partnerLogos`/`meetupImages`/`sponsors` 공용): `id?`, `imageFile?` — flat `File[]`가 아니라 다른 목록과 동일하게 **인덱스가 붙은 객체 배열**입니다.
- 모든 목록 항목은 `name` 필수(없으면 400), `id`가 잘못됐거나 중복되면 400.

## 멀티파트 직렬화 방식

컨트롤러가 `@ModelAttribute IntroRequest request`로 바인딩합니다. `List<객체>` 필드는 **인덱스를 붙인 필드명**으로 보내야 합니다(`partnerLogos`/`meetupImages`/`sponsors` 포함, 더 이상 flat 파일 반복 방식이 아닙니다).

```
teams[0].id=1
teams[0].name=학부학
teams[0].description=학부학은 ~을 관리합니다.
teams[0].imageFile=@photo1.jpg

activities[0].id=1
activities[0].name=밋업데이
activities[0].imageFile1=@a.jpg
activities[0].description=밋업데이는 ~입니다.

partnerLogos[0].id=1
partnerLogos[1].imageFile=@newlogo.png
```

## PUT은 이제 부분 업데이트입니다 (이전 문서와 달라진 핵심)

과거에는 목록 필드를 매번 전체 삭제 후 재생성했지만, 지금은 다음 규칙으로 바뀌었습니다.

- `teams`/`expertLecture`/`obLecture`/`activities`/`partnerLogos`/`meetupImages`/`sponsors` 필드 자체를 **생략하면 기존 목록이 그대로 유지**됩니다.
- 필드를 보내면, 그 목록 안에서: `id`가 있으면 해당 항목 수정 / `id`가 없으면 새 항목 추가 / 기존에 있었지만 이번 요청에 포함되지 않은 항목은 삭제됩니다. 목록은 **보낸 순서대로 정렬**됩니다.
- 항목에 `imageFile`을 첨부하지 않으면 기존 이미지가 유지됩니다(과거처럼 `null`이 되지 않습니다). 이미지만 지우고 텍스트는 유지하려면 `removeImage`(`activities`는 `removeImage1`/`removeImage2`)를 `true`로 보냅니다.
- 배너 상태/이미지 외 단일 필드(`planningImage` 등)는 과거와 동일하게 생략 시 기존 값 유지.

**어드민 수정 시 `id`를 반드시 함께 보내야** 기존 항목이 "수정"으로 처리됩니다. GET 응답의 각 항목 `id`를 그대로 들고 있다가 PUT 요청에 포함시켜야 하며, `id`를 빼고 보내면 새 항목으로 추가되고 기존 항목은 (응답에 없으므로) 삭제됩니다.

## Response (`GET`, `AdminIntroResponse`) — 2026-11-09 Swagger 기준

```
{
  "banner_cardinal": number | null,
  "banner_status": string | null,
  "member_count": number | null,
  "project_count": number | null,
  "university_count": number | null,
  "intro_youtube_link": string | null,
  "planning_image_url": string | null,
  "design_image_url": string | null,
  "frontend_image_url": string | null,
  "backend_image_url": string | null,
  "partner_logos": { "id": number, "image_url": string | null }[],
  "meetup_images": { "id": number, "image_url": string | null }[],
  "activities": { "id": number, "name": string, "image_url1": string | null, "image_url2": string | null, "description": string }[],
  "teams": { "id": number, "name": string, "image_link": string | null, "description": string }[],
  "expert_lecture": { "id": number, "name": string, "image_link": string | null, "corporation": string, "description": string }[],
  "ob_lecture": { "id": number, "name": string, "image_link": string | null, "topic": string }[],
  "sponsors": { "id": number, "image_url": string | null }[]
}
```

이전 버전과의 차이:

- `slogan`, `banner_image_url` 제거됨.
- `partner_logo_urls`/`meetup_image_urls`/`sponsor_image_urls`(`string[]`) → `partner_logos`/`meetup_images`/`sponsors`(`{id, image_url}[]`)로 교체.
- `teams`/`activities`/`expert_lecture`/`ob_lecture`의 각 항목에 `id` 추가(수정 요청 시 그대로 재사용).

응답은 전부 snake_case, 요청(`IntroRequest`)은 camelCase입니다.

**이미지 URL 절대 경로 여부**: 이번 Swagger의 `image_link`/`image_url` 예시 값은 전부 `https://kusitms-bucket.s3.ap-northeast-2.amazonaws.com/...` 형태의 절대 URL로 바뀌었습니다. 다만 Swagger `example`은 스키마 작성자가 직접 적은 예시일 뿐이라 실제 운영 응답이 그런지는 별도로 확인이 필요합니다 — 확인 전까지는 프론트의 `toAbsoluteS3Url()`(`src/lib/s3.ts`) 정규화를 그대로 유지합니다. 확인되면 `.claude/known-issues/records/api-introductions-image-url-not-absolute.md`를 종료 처리합니다.

## 이미지 포맷

PNG/JPG만 허용됩니다(SVG는 깨짐). 프론트 업로드 input에 `accept="image/png,image/jpeg"`를 적용합니다.

## 구현 메모

- API 함수는 `src/api/introductions.ts`에 둔다.
- query key는 `['admin', 'introductions']`를 우선한다. 수정은 `multipart/form-data`이고, 수정 이후 조회 query를 invalidate한다.
- `IntroductionsPage` UI는 슬로건/배너 이미지 입력란 없이, `IntroRequest`의 나머지 필드를 다룬다: 배너 상태(`bannerStatus`)·기수, 회원·프로젝트·대학 수, 학회 소개 영상(`introYoutubeLink`), 파트별 이미지 4종, 운영진(`teams`), 큐시즘 활동(`activities`, 이미지 2개), 밋업 이미지, 파트너사 로고, 전문가/OB 강연자, 후원사 이미지.
- GET 응답은 `useIntroductionsForm.ts`의 `hydrateFromResponse`가 최초 로드 시 폼에 하이드레이션하며, 각 항목의 `id`를 `remoteId`로 보관해 저장 시 PUT 요청에 그대로 실어 보낸다(이게 빠지면 저장마다 기존 항목이 전부 "새 항목"으로 처리돼 중복/이미지 소실이 난다).
- 목록 항목의 "이미지만 삭제"(`removeImage`)는 아직 UI에 없다 — 현재는 항목 전체 삭제 또는 이미지 교체만 지원한다. 필요해지면 추가한다.
