# `GET /admin/meetup` 응답의 `logo_url`/`poster_url`이 버킷 도메인과 key 사이에 슬래시가 빠져 있음

## 무엇이 다른지

`logo_url`/`poster_url`/`web_thumbnail_url`이 완전한 URL처럼 보이지만(`https://`로 시작), 실제로는 버킷 도메인과 S3 key가 슬래시 없이 그냥 붙어 있다.

```json
"poster_url": "https://kusitms-bucket.s3.ap-northeast-2.amazonaws.commeetup/9eb1ea3f-fec5-4ee9-bdda-70ab78731091티키탁 포스터.png"
```

`.amazonaws.com`과 `meetup/...` 사이에 `/`가 없어서, 이 값을 그대로 `<img src>`에 넣으면 존재하지 않는 호스트(`...amazonaws.commeetup`)로 요청이 나가 깨진 이미지가 된다.

## 어디서 확인했는지

2026-10-26, 사용자가 실제 `GET /admin/meetup` 응답을 공유해서 확인했다. 백엔드 레포의 `MeetupDetailResponse` 생성자를 보면 원인이 바로 보인다.

```java
this.posterUrl = s3Url + meetup.getPosterUrl();
this.logoUrl = s3Url + meetup.getLogoUrl();
```

`s3Url`은 `S3Util`이 `aws.s3.prefix` 환경변수에서 주입받는 값(`https://kusitms-bucket.s3.ap-northeast-2.amazonaws.com`, 끝에 슬래시 없음)이고, `meetup.getPosterUrl()`은 `S3Service.uploadFile()`이 반환/저장한 key(`meetup/{uuid}{원본파일명}`, 앞에 슬래시 없음)다. 둘을 `+`로 그냥 이어붙이기만 해서 슬래시가 빠진다.

introductions의 `banner_image_url` 등이 key만 반환하는 것과는 다른 버그다(그쪽은 아예 `s3Url`을 붙이지 않음). 같은 원인(버킷 도메인 하드코딩이 백엔드 코드 여러 곳에 흩어져 있고 일관되게 처리되지 않음)에서 나온 다른 증상이다.

## 왜 지금 우리 코드에서 고치면 안 되는지

백엔드 응답 조합 로직의 문제라 프론트에서 원인 자체를 고칠 수 없다. 다만 버킷 도메인(`https://kusitms-bucket.s3.ap-northeast-2.amazonaws.com`)이 이미 알려져 있고 패턴이 결정적이라(도메인 뒤에 key가 슬래시 유무와 상관없이 붙어있음), `src/lib/s3.ts`의 `toAbsoluteS3Url()`이 도메인 접두사를 제거하고 다시 슬래시를 붙여 정규화하는 방식으로 우회한다. 이 함수는 introductions의 "key만 반환" 버그와 이 "슬래시 누락" 버그를 모두 같은 방식으로 정규화한다.

## 언제/누가 해결해야 하는지

**백엔드 담당**: `MeetupDetailResponse`(그리고 같은 패턴을 쓰는 다른 응답이 있다면 함께)에서 `s3Url + key`가 아니라 `s3Url`에 슬래시를 포함하거나 `String.join("/", ...)`처럼 구분자를 보장하는 방식으로 고쳐야 한다. `.claude/known-issues/records/api-introductions-image-url-not-absolute.md`에 적어둔 "완전한 URL을 반환하도록 응답 구성 로직 자체를 정리해야 한다"는 요청과 같이 전달하는 게 좋다. 백엔드가 고치면 `toAbsoluteS3Url()`의 하드코딩된 버킷 도메인을 제거한다.
