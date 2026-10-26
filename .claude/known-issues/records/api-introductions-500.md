# `GET /api/introductions`가 HTTP 200이지만 응답 본문의 code는 500임(Swagger 문서와 다름)

## 무엇이 다른지

Swagger는 `GET /api/introductions`(공개, 인증 불필요)가 200과 `IntroResponse` 스키마를 반환한다고 문서화하지만, 실제로는 HTTP 200에 본문 `{"code":500,"message":"INTER SERVER ERROR"}`를 반환한다.

## 어디서 확인했는지

```bash
curl -s -w "\nHTTP_STATUS:%{http_code}\n" "https://kusitms.herokuapp.com/api/introductions"
```

2회 호출 모두 동일하게 재현됨(2026-07-24 확인). 이후 관리자 토큰으로 `GET /admin/introductions`를 호출해도 동일하게 HTTP 500 `{"code":500,"message":"INTER SERVER ERROR"}`가 재현됐다(2026-10-26 확인, 이번엔 공개 endpoint가 아니라 admin endpoint).

## 원인 확정 (백엔드 소스 확인, 2026-10-26)

백엔드 레포(`kusitms-com/api.kusitms.com`)의 `IntroService`를 직접 확인했다. `getIntroduction()`/`getAdminIntroduction()`/`updateIntroduction()` 전부 아래처럼 시작한다.

```java
Introduction intro = introRepository.findAll().stream().findFirst()
        .orElseThrow(() -> new EntityNotFoundException("학회 소개 정보가 존재하지 않습니다."));
```

**DB의 `introduction` 테이블에 row가 하나도 없으면 무조건 예외가 터져서 500이 된다.** 데이터가 아예 없는 상태였던 게 맞다(버그라기보다는, 빈 데이터를 500으로 처리하는 게 좋지 않은 설계에 가깝다).

row를 만드는 건 `POST /admin/introductions`(`addIntroduction`, Swagger에 `@Hidden`으로 숨겨져 있어 목록엔 안 보임) 하나뿐이다. 이걸 한 번도 호출한 적이 없어서 GET/PUT이 전부 500이었다.

## 왜 지금 우리 코드에서 고치면 안 되는지

백엔드 서버/DB 상태 문제라 프론트엔드에서 고칠 수 있는 부분이 아니다. 다만 원인과 우회 방법은 확정됐으므로, admin 연동 자체는 더 이상 이 이슈에 막히지 않는다.

## 언제/누가 해결해야 하는지

**우회 방법(바로 가능)**: `POST /admin/introductions`를 관리자 토큰으로 한 번 호출해 초기 데이터를 생성하면 그 이후 GET/PUT이 정상 동작한다. admin 연동 작업 시작 전에 이것부터 한다.

**근본 해결(백엔드 담당)**: 데이터가 없는 상태를 500 대신 200 + 빈/기본 응답이나 404로 처리하도록 개선을 요청하는 게 좋다 — 지금 구조면 운영 중 DB가 초기화되거나 row가 삭제되는 사고가 나도 500만 보이고 원인 파악이 어렵다.
