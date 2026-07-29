# 어드민 학회 소개 API Reference

Swagger 출처: `https://kusitms.herokuapp.com/api-docs/json`

학회 소개 페이지의 관리자 조회/수정에는 이 파일을 사용합니다.

## Endpoints

| Method | Path | Operation ID | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/introductions` | `getIntroduction_1` | 없음 | `BaseResponseObject` |
| `PUT` | `/admin/introductions` | `updateIntroduction` | `IntroRequest` multipart | `BaseResponseObject` |

`BaseResponseObject.data`는 Swagger에 구체적 스키마 없이 `object`로만 선언돼 있다 — 조회 응답의 실제 shape는 계약으로 확정되지 않았다. 자세한 내용과 미검증 추정은 문서 맨 아래 "미검증 가정: 조회 응답 shape" 참고.

## Request Fields

### `IntroRequest`

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
| `obLecture` | `OBLectureRequest[]` (`name`, `topic`, `image_file`) — 이 필드만 snake_case |
| `partnerLogoFiles` | `File[]` (파트너사 로고, `sponsors`와 별개) |
| `meetupImages` | `File[]` |
| `activities` | `ActivityRequest[]` (`name`, `description`, `imageFile1`, `imageFile2`) |
| `sponsors` | `File[]` (후원사 이미지) |

이 표는 Swagger 스키마에서 그대로 확인한 필드 목록이다.

## 구현 메모

- API 함수는 `src/api/introductions.ts`에 둔다.
- query key는 `['admin', 'introductions']`를 우선한다. 수정은 `multipart/form-data`이고, 수정 이후 조회 query를 invalidate한다.
- Swagger schema에 `required` 목록이 없어 요청 필드의 필수 여부가 불명확하다(optional이라고 단정할 수 없음 — Swagger에 없다고 실제 서버가 안 요구하는 건 아니다). 구현 시 실제 admin PUT 호출로 어떤 필드가 필수인지, 생략한 필드를 서버가 "기존 값 유지"로 처리하는지 확인하고 그 결과를 계약으로 문서화한다.
- multipart로 중첩 배열(`teams`, `activities`, `expertLecture`, `obLecture`)을 직렬화하는 방식이 Swagger에 없다 — 구현 시 실제 서버로 확인한다.
- `teams`/`activities`/`sponsors`는 항목에 id가 없어 부분 갱신이 안 될 수 있다(서버가 배열을 전체 교체로 처리하면, 안 바꾼 이미지도 다시 보내야 함). 구현 시 서버 동작을 확인하고 필요하면 URL→File 재업로드 또는 백엔드에 id 추가를 요청한다.
- `IntroductionsPage` UI는 슬로건/배너 이미지, 회원·프로젝트·대학 수, 파트별 이미지 4종, 큐시즘 활동(이미지 1개만), 운영진, 후원사만 다룬다. `bannerStatus`, `introYoutubeLink`, `expertLecture`, `obLecture`, `meetupImages`, `partnerLogoFiles`, `activities[].imageFile2`는 편집 UI가 없다 — 연동 시 값을 보내거나 보여줄 수 없다.

## 미검증 가정: 조회 응답(`data`) shape

**아래 내용은 계약이 아니라 가설이다.** 실제 admin 토큰으로 `GET /admin/introductions` 응답을 확인하기 전까지 `IntroRequest`(위 Request Fields)처럼 신뢰하고 구현하면 안 된다.

같은 데이터를 반환할 것으로 보이는 공개 endpoint `GET /api/introductions`(`operationId: getIntroduction`, 인증 불필요)는 `IntroResponse`로 Swagger 스키마가 명확하다. `/admin/introductions`의 `data`가 이 `IntroResponse`와 같은 shape일 것이라고 추정하지만, 이 공개 endpoint가 현재 500을 반환해(`.claude/known-issues/records/api-introductions-500.md` 참고) 실제 응답으로 검증하지 못했다.

### `IntroResponse` (미검증 추정)

| Field | Type |
| --- | --- |
| `slogan` | `string` |
| `teams` | `ManagementTeamResponse[]` (`name`, `description`, `image_link`) |
| `activities` | `ActivityResponse[]` (`name`, `description`, `image_url1`, `image_url2`) |
| `banner_status` | `string` |
| `banner_content` | `string` |
| `banner_image_url` | `string` |
| `member_count` / `project_count` / `university_count` | `number` |
| `intro_youtube_link` | `string` |
| `planning_image_url` / `design_image_url` / `frontend_image_url` / `backend_image_url` | `string` |
| `partner_logo_urls` / `meetup_image_urls` / `sponsor_image_urls` | `string[]` |
| `expert_lecture` | `ExpertLectureResponse[]` (`name`, `corporation`, `description`, `image_link`) |
| `ob_lecture` | `OBLectureResponse[]` (`name`, `topic`, `image_link`) |

응답은 snake_case, 요청(`IntroRequest`)은 camelCase다. `bannerCardinal`은 요청에만 있고 이 추정 응답에는 없다 — 조회로 현재 기수를 복원할 수 없다는 뜻이다(이 역시 실제 응답 확인 전까지는 가설).

`banner_status`/`banner_content`는 Figma·실제 홈페이지 기준 모집 배너 문구 자체가 쓰이지 않는 것으로 확인돼 `IntroductionsPage` 구현 범위 밖이다. 응답 shape나 `bannerCardinal`/`bannerStatus`와의 관계는 추측하지 않는다.
