# `GET /admin/introductions` 응답의 이미지 URL 필드가 절대 URL이 아니라 S3 object key만 내려옴

## 무엇이 다른지

Swagger 스키마(`AdminIntroResponse`)는 `banner_image_url`, `planning_image_url` 등 `*_url`/`*_image_url`/`image_link` 필드가 바로 `<img src>`에 쓸 수 있는 접근 가능한 URL이라고 암묵적으로 기대하게 만들지만, 실제 응답 값은 아래처럼 S3 object key(버킷/리전 정보가 없는 상대 경로)만 내려온다.

```json
{
  "banner_image_url": "intro/b7dc5c34-23f5-457d-998f-8d0eab9c7c3c33기 배너 이미지.png",
  "partner_logo_urls": ["intro/dd7fd770-edf4-40cc-8888-d139f398d341Litmus.png"]
}
```

이 값을 그대로 `<img src="intro/...">`에 넣으면 프론트엔드 origin 기준 상대 경로로 해석돼 깨진 이미지 아이콘만 뜬다.

## 어디서 확인했는지

1. `POST /admin/introductions`로 실제 이미지 파일들을 업로드해 초기 데이터 생성(2026-10-26).
2. `GET /admin/introductions`로 조회한 응답을 직접 확인 — 모든 이미지 필드가 `intro/{uuid}{원본파일명}` 형태였고, `https://`로 시작하는 값이 하나도 없었다.
3. 백엔드 레포(`kusitms-com/api.kusitms.com`)의 `S3Service.uploadFile()`을 확인했다.

```java
public String uploadFile(MultipartFile multipartFile, String dirName) {
    String fileName = randomFileName(multipartFile, dirName); // "intro/{uuid}{originalFilename}"
    ...
    amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, ...)
            .withCannedAcl(CannedAccessControlList.PublicRead));
    ...
    return fileName; // 버킷/리전이 붙은 완전한 URL이 아니라 key만 반환
}
```

`Introduction`/`Activity`/`ManageTeam`/`ExpertLecture`/`OBLecture`/`PartnerLogo`/`IntroMeetupImage`/`Sponsor` 전부 이 `uploadFile()`의 반환값을 그대로 `imageUrl`/`imageLink` 컬럼에 저장하므로, 학회 소개 도메인의 이미지 필드 전부가 동일한 문제를 가진다.

## 왜 지금 우리 코드에서 고치면 안 되는지

S3 버킷명/리전(`cloud.aws.s3.bucket`)은 백엔드 환경 변수로만 주입되고(`application.yml`/레포에 커밋돼 있지 않음) Swagger 스키마 응답 필드 자체에는 노출되지 않는다. 다만 백엔드 레포의 `OBLectureResponse`/`ExpertLectureResponse`/`ManagementTeamResponse`의 Swagger `@Schema(example = ...)` 값과 `MailService.java`에 하드코딩된 상수에서 실제 버킷 도메인(`https://kusitms-bucket.s3.ap-northeast-2.amazonaws.com`)을 확인했고, 응답 key를 이 도메인 뒤에 붙여 `curl`로 200을 확인했다(2026-10-26). 그래서 "근본 해결"은 여전히 백엔드가 완전한 URL을 반환하는 것이지만, 프론트에서 이 도메인을 상수로 하드코딩해 당장 우회하는 것도 가능하다 — `src/hooks/introductions/useIntroductionsForm.ts`의 `toAbsoluteImageUrl()` 참고(`ponytail:` 주석으로 표시).

## 언제/누가 해결해야 하는지

**백엔드 담당**: `S3Service.uploadFile()`이 `fileName`(key) 대신 완전한 URL(또는 CloudFront 등 CDN 도메인)을 반환하도록 수정 요청이 필요하다. 백엔드가 고치면 프론트의 `toAbsoluteImageUrl()` 우회 코드(하드코딩된 버킷 도메인)는 제거한다 — 버킷/리전이 바뀌면 이 하드코딩은 조용히 깨진다.
