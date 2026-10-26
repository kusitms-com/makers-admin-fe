# 어드민 학회 소개 API Reference

Swagger 출처: `.env`의 `VITE_API_BASE_URL` + `/api-docs/json`

학회 소개 페이지의 관리자 조회/수정에는 이 파일을 사용합니다.

아래 내용은 Swagger뿐 아니라 백엔드 레포(`kusitms-com/api.kusitms.com`)의 `IntroRequest`/`AdminIntroResponse`/`IntroService`/`AdminController` 소스로 직접 검증했습니다. 특히 응답 shape와 멀티파트 직렬화 방식은 Swagger만으로는 끝까지 확인이 안 됐던 부분입니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/introductions` | `getIntroduction_1` | 없음 | `BaseResponseObject` (`data`: `AdminIntroResponse`) |
| `PUT` | `/admin/introductions` | `updateIntroduction` | `IntroRequest` multipart | `BaseResponseObject` |
| `POST` | `/admin/introductions` | (Swagger에 `@Hidden`으로 숨김) | `IntroRequest` multipart | `BaseResponseObject` |

**`POST`는 최초 1회 데이터 생성용입니다.** `IntroService`의 GET/PUT이 전부 `introRepository.findAll().stream().findFirst().orElseThrow(...)`로 시작해서, DB에 학회 소개 row가 하나도 없으면 GET과 PUT 둘 다 500을 반환합니다. `POST`(`addIntroduction`)만 새 row를 생성합니다. 환경에 데이터가 없으면 PUT을 연동하기 전에 `POST`를 한 번 호출해 초기 데이터를 만들어야 합니다. 관련 내용은 `.claude/known-issues/records/api-introductions-500.md` 참고.

## Request Fields (`IntroRequest`)

| Field | Type |
| --- | --- |
| `bannerCardinal` | `number` |
| `bannerStatus` | `'CLOSE' \| 'MANAGE_RECRUIT' \| 'MEMBER_RECRUIT'` |
| `slogan` | `string` |
| `bannerImageFile` | `File` |
| `memberCount` / `projectCount` / `universityCount` | `number` |
| `introYoutubeLink` | `string` |
| `planningImage` / `designImage` / `frontendImage` / `backendImage` | `File` |
| `teams` | `ManagementTeamRequest[]` (`name`, `description`, `imageFile`) |
| `expertLecture` | `ExpertLectureRequest[]` (`name`, `corporation`, `description`, `imageFile`) |
| `obLecture` | `OBLectureRequest[]` (`name`, `topic`, `imageFile`) |
| `partnerLogoFiles` | `File[]` (파트너사 로고, `sponsors`와 별개) |
| `meetupImages` | `File[]` |
| `activities` | `ActivityRequest[]` (`name`, `description`, `imageFile1`, `imageFile2`) |
| `sponsors` | `File[]` (후원사 이미지) |

`obLecture.imageFile`은 Swagger 스키마 문서에 `@JsonProperty("image_file")`로 표시돼 있지만, 이 컨트롤러는 `@ModelAttribute`로 바인딩하기 때문에 Jackson `@JsonProperty`는 적용되지 않습니다(`@RequestBody`가 아님). 실제 멀티파트 필드명은 Java 프로퍼티명 그대로인 `imageFile`입니다 — 이전 버전 문서의 "obLecture만 snake_case" 설명은 틀린 내용이었습니다.

## 멀티파트 직렬화 방식 (확정)

컨트롤러가 `@ModelAttribute IntroRequest request`로 바인딩합니다(`AdminController`). `List<객체>` 필드는 **인덱스를 붙인 필드명**으로 보내야 합니다. Swagger "Try it out"이 보여주는 `teams={...JSON...}` 형태는 Swagger UI가 "파일 포함 객체 배열"을 제대로 못 그려서 생기는 잘못된 예시이며, 실제 요청과 다릅니다.

```
teams[0].name=학부학
teams[0].description=학부학은 ~을 관리합니다.
teams[0].imageFile=@photo1.jpg
teams[1].name=교육기획팀
teams[1].imageFile=@photo2.jpg

activities[0].name=밋업데이
activities[0].imageFile1=@a.jpg
activities[0].imageFile2=@b.jpg
activities[0].description=밋업데이는 ~입니다.
```

`partnerLogoFiles`/`meetupImages`/`sponsors`처럼 단순 `File[]`인 필드는 같은 필드명을 파일 개수만큼 반복해서 보냅니다(인덱스 불필요, Spring이 `List<MultipartFile>`로 자동 바인딩).

## PUT은 배열 필드를 매번 전체 교체합니다 (중요)

`IntroService.updateIntroduction()`은 `teams`/`expertLecture`/`obLecture`/`partnerLogoFiles`/`meetupImages`/`activities`/`sponsors`에 해당하는 테이블을 **매번 전부 delete한 뒤, 요청에 들어있는 것만 다시 insert**합니다.

- 부분 업데이트가 불가능합니다. PUT 한 번에 바뀌지 않은 항목까지 항상 전부 다시 보내야 합니다.
- **`teams[i].imageFile` / `activities[i].imageFile1,2`는 "파일 없으면 기존 URL 유지" 로직이 없습니다.** 항목을 다시 보내면서 파일을 첨부하지 않으면 그 항목의 이미지 URL이 `null`이 됩니다. (배너/파트별 이미지 같은 단일 필드는 반대로 파일 생략 시 기존 값을 유지합니다 — `uploadOrKeep`)
- `IntroductionsPage` UI가 다루지 않는 필드(`bannerStatus`, `introYoutubeLink`, `expertLecture`, `obLecture`, `meetupImages`, `activities[].imageFile2`)를 PUT 요청에서 생략하면, 그 데이터가 서버에 이미 존재하더라도 **전부 삭제됩니다.** 이 UI로 저장을 시작하기 전에 이 필드들에 실제 데이터가 있는지, 있다면 지워져도 되는지 팀 내 확인이 필요합니다.

## Response (`GET`, `AdminIntroResponse`) — 확정됨

```
{
  "banner_cardinal": number | null,
  "banner_status": string | null,
  "slogan": string | null,
  "banner_image_url": string | null,
  "member_count": number | null,
  "project_count": number | null,
  "university_count": number | null,
  "intro_youtube_link": string | null,
  "planning_image_url": string | null,
  "design_image_url": string | null,
  "frontend_image_url": string | null,
  "backend_image_url": string | null,
  "partner_logo_urls": string[],
  "meetup_image_urls": string[],
  "activities": { "name": string, "image_url1": string | null, "image_url2": string | null, "description": string }[],
  "teams": { "name": string, "image_link": string | null, "description": string }[],
  "expert_lecture": { "name": string, "image_link": string | null, "corporation": string, "description": string }[],
  "ob_lecture": { "name": string, "image_link": string | null, "topic": string }[],
  "sponsor_image_urls": string[]
}
```

응답은 전부 snake_case(`@JsonProperty`), 요청(`IntroRequest`)은 camelCase입니다. `bannerCardinal`은 요청에만 있고 응답에는 `banner_cardinal`로 내려옵니다.

`banner_status`/`banner_content`는 Figma·실제 홈페이지 기준 모집 배너 문구 자체가 쓰이지 않는 것으로 확인돼 `IntroductionsPage` 구현 범위 밖입니다.

## 구현 메모

- API 함수는 `src/api/introductions.ts`에 둔다.
- query key는 `['admin', 'introductions']`를 우선한다. 수정은 `multipart/form-data`이고, 수정 이후 조회 query를 invalidate한다.
- `IntroductionsPage` UI는 `IntroRequest`의 모든 필드를 다룬다: 배너 상태(`bannerStatus`)/슬로건/배너 이미지, 회원·프로젝트·대학 수, 학회 소개 영상(`introYoutubeLink`), 파트별 이미지 4종, 운영진(`teams`), 큐시즘 활동(`activities`, 이미지 2개), 밋업 이미지, 파트너사 로고(`partnerLogoFiles`), 전문가/OB 강연자, 후원사 이미지(`sponsors`).
- `partnerLogoFiles`(파트너사)와 `sponsors`(후원사)는 별도 필드이므로 UI에서도 별도 섹션(`ImageSection`)으로 분리해 바인딩한다.
- GET 응답을 폼에 하이드레이션하는 로직은 아직 없다 — 저장 시 항상 폼의 현재 상태로 PUT을 보낸다. 위 "PUT은 배열 필드를 매번 전체 교체" 항목 참고.
