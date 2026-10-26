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

백엔드의 null 체크 누락이라 프론트엔드에서 원인 자체를 고칠 수 없다. 다만 Swagger와 동일하게 `tag` 필드에 빈 문자열 하나를 보내면 NPE를 피할 수 있다는 게 확인됐으므로, `src/api/projects.ts`의 `buildCorporateFormData()`에서 `formData.append('tag', '')`로 우회한다(`tag` 입력 UI가 아직 없어서 실제 태그 값은 항상 비어 있다).

## 언제/누가 해결해야 하는지

**우회 방법(적용 완료)**: `src/api/projects.ts`의 `buildCorporateFormData()`에서 `tag` 필드에 빈 문자열을 보낸다.

**근본 해결(백엔드 담당)**: `AdminService#saveCorporate`/`updateCorporate`에서 `request.getTag()`가 null일 수 있음을 null 체크하거나(`request.getTag() != null ? request.getTag() : List.of()`), `CorporateRequest.tag`에 기본값(`= new ArrayList<>()`)을 둬야 한다. 같은 레포의 밋업 `logoFile`/`posterFile` null 체크 누락(`.claude/known-issues/records/api-meetup-image-url-missing-slash.md` 참고 커밋 당시 발견)과 같은 패턴이라, 백엔드 팀에 함께 전달하면 좋다. 백엔드가 고치면 이 workaround(`tag` 빈 문자열 전송)는 제거해도 된다 — 단, `tag` 입력 UI를 나중에 만들 때는 실제 값을 보내도록 바꿔야 한다.
