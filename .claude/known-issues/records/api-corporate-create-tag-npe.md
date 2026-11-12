# `POST /admin/projects/corporate`가 `tag` 필드를 생략하면 500이 남(NPE)

## 무엇이 다른지

`CorporateRequest`의 `tag`는 Swagger 스펙상 선택(optional)처럼 보이는 `array` 필드지만, 실제로는 멀티파트 요청에 `tag`를 아예 포함하지 않으면 HTTP 200이 아니라 500 `{"code":500,"message":"INTER SERVER ERROR"}`가 난다. `cardinal`/`name`/`content`/`logoFile`/`bannerFile`을 모두 정상적으로 채워도 재현됐다.

## 어디서 확인했는지

사용자가 실제 브라우저(Safari, Chrome 둘 다)에서 `CompanyProjectModal`로 등록을 시도하며 매번 500을 재현했고(파일 종류/용량/회사명을 바꿔가며 여러 번 확인), 반면 Swagger UI의 "Try it out"으로는 매번 성공했다. 토큰·필드값·파일을 동일하게 맞춰도 차이가 재현돼서, 백엔드 레포(`kusitms-com/api.kusitms.com`)를 직접 확인했다(2026-10-26).

## 원인 확정 (백엔드 소스 확인, 2026-10-26)

`AdminService#saveCorporate`(`updateCorporate`도 동일):

```java
String category = "";
for(int i = 0; i < request.getTag().size(); i++) {
    ...
}
```

`CorporateRequest.tag`는 기본값 초기화가 없다(`private List<String> tag;`). 멀티파트 요청에 `tag` 파라미터가 없으면 Spring이 `null`로 바인딩하고, `request.getTag().size()`가 바로 NullPointerException을 던진다. 잡히지 않은 예외라 공통 500 핸들러로 떨어진다.

Swagger UI가 매번 성공했던 이유도 이걸로 설명된다 — Swagger는 비워둔 배열 필드도 내부적으로 빈 문자열 1개(`tag=""`)를 기본으로 보내는 것으로 보인다. 실제로 Swagger로 등록된 데이터의 `GET /admin/corporate` 응답에 `"category": [""]`가 찍혀 있었는데, 이는 `tag`가 `[""]`(원소 1개, 빈 문자열)였을 때만 나올 수 있는 값이다(`category`는 `tag`를 `#`로 join해서 만든다).

## 왜 지금 우리 코드에서 고치면 안 되는지

백엔드의 null 체크 누락이라 프론트엔드에서 원인 자체를 고칠 수 없다. 당시에는 Swagger와 동일하게 `tag` 필드에 빈 문자열 하나를 보내 NPE를 피했다(`formData.append('tag', '')`). 이 우회는 현재 제거됐다.

## 언제/누가 해결해야 하는지

**우회 방법(제거됨, 2026-11-11)**: 과거에는 `buildCorporateFormData()`에서 `tag` 필드에 빈 문자열을 보냈다. 백엔드 수정이 운영에 배포되어 지금은 `tag`를 보내지 않는다(아래 상태 갱신 참고).

**근본 해결(백엔드 담당)**: `AdminService#saveCorporate`/`updateCorporate`에서 `request.getTag()`가 null일 수 있음을 null 체크하거나(`request.getTag() != null ? request.getTag() : List.of()`), `CorporateRequest.tag`에 기본값(`= new ArrayList<>()`)을 둬야 한다. 같은 레포의 밋업 `logoFile`/`posterFile` null 체크 누락(`.claude/known-issues/records/api-meetup-image-url-missing-slash.md` 참고 커밋 당시 발견)과 같은 패턴이라, 백엔드 팀에 함께 전달하면 좋다. 백엔드가 고치면 이 workaround(`tag` 빈 문자열 전송)는 제거해도 된다 — 단, `tag` 입력 UI를 나중에 만들 때는 실제 값을 보내도록 바꿔야 한다.


## 상태 갱신 (2026-11-11) — 해소

**운영 배포 확인**: 백엔드는 `main` push 시 `.github/workflows/CD.yaml`로 Heroku에 자동 배포된다. 이 수정이 포함된 `289ee1d`의 CD 실행이 2026-11-09 `success`로 끝났다(GitHub Actions 기록, 2026-11-12 확인). 그래서 프론트에서 `tag` 생략으로 바꿔도 운영에서 NPE가 나지 않는다.

백엔드 main(`289ee1d`)에서 `resolveTags`가 `tag == null`을 빈 목록으로 처리해 NPE가 사라졌다(`AdminService.java:292-294`). `updateCorporate`는 `tag`가 있을 때만 태그를 교체한다(`:230-236`).

빈 문자열 workaround(`tag=''`)는 오히려 수정 시 기존 태그를 지우므로 제거했다. 이제 프론트는 `tag`를 보내지 않는다(`src/api/projects/api.ts`의 `buildCorporateFormData`).
