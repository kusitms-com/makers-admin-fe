# `PUT /admin/introductions`에서 목록을 전부 삭제하고 저장해도 서버에 반영되지 않을 수 있음

## 무엇이 다른지

백엔드 계약(Swagger `IntroRequest`의 `teams`/`expertLecture`/`obLecture`/`activities`/`partnerLogos`/`meetupImages`/`sponsors` 설명)은 "필드를 생략하면 기존 목록 유지, 전달하면 id 기준으로 수정·추가하고 안 보낸 기존 항목은 삭제"라고 명시한다. 그런데 "0개 항목을 전달"과 "필드 자체를 생략"이 멀티파트 와이어 레벨에서 구분되지 않는다.

`src/api/introductions.ts`의 `appendIndexedItems`는 `items.forEach`로 항목이 있을 때만 `key[i].field`를 append한다. 목록을 0개로 비운 뒤 저장하면 그 키 이름 자체가 요청에 하나도 나타나지 않는다. 백엔드가 `@ModelAttribute`로 바인딩할 때 인덱스 키가 하나도 없으면 해당 필드는 그냥 안 건드려진(바인딩되지 않은) 상태가 되므로, "생략"과 동일하게 처리되어 기존 항목이 삭제되지 않고 그대로 남을 가능성이 높다.

즉: 사용자가 `IntroductionsPage`에서 운영진/활동/강연자/파트너로고 카드를 전부 삭제하고 저장하면, 화면상으로는 저장에 성공한 것처럼 보이지만 서버에는 그 삭제가 반영되지 않을 수 있다.

## 어디서 확인했는지

2026-11-09, PR #57 코드 리뷰(CodeRabbit)에서 지적됨. `src/api/introductions.ts`의 `appendIndexedItems`/`buildIntroFormData` 구현과 `.claude/references/api/admin-introductions.md`에 기록된 백엔드 계약 설명을 대조해 확인했다. 실제 운영 API로 "목록을 0개로 비우고 PUT" 케이스를 직접 호출해 재현하지는 않았다(추론 기반 확인).

## 왜 지금 우리 코드에서 고치면 안 되는지

인덱스 기반 멀티파트 바인딩(`teams[0].name=...`) 특성상 "항목이 0개인 리스트를 명시적으로 보낸다"를 표현할 표준적인 방법이 없다. 백엔드가 "생략"과 "명시적으로 비움"을 구분하려면 별도 규약(예: 리스트 전용 플래그, 혹은 인덱스 키 유무와 무관하게 touched 여부를 알려주는 별도 필드)이 필요한데, 현재 Swagger/백엔드 공지에는 이 부분이 명시돼 있지 않다. 확인 없이 추측해서 구현하면 조용한 데이터 손실이 반복될 위험이 있다.

## 언제/누가 해결해야 하는지

**백엔드 담당**: "목록을 전부 비우고 싶을 때 어떻게 보내야 하는지"에 대한 규약을 확정하고 공유해야 한다. 규약이 정해지면 `src/api/introductions.ts`와 `.claude/references/api/admin-introductions.md`를 함께 갱신한다.

**확인 전까지**: 프론트는 현재 구현을 유지한다(목록을 전부 지우는 저장 시나리오에 대한 방어 로직은 아직 추가하지 않음 — 2026-11-09 논의에서 known-issue로만 기록하고 코드는 보류하기로 결정).
