# `GET /api/introductions`가 HTTP 200이지만 응답 본문의 code는 500임(Swagger 문서와 다름)

## 무엇이 다른지

Swagger는 `GET /api/introductions`(공개, 인증 불필요)가 200과 `IntroResponse` 스키마를 반환한다고 문서화하지만, 실제로는 HTTP 200에 본문 `{"code":500,"message":"INTER SERVER ERROR"}`를 반환한다.

## 어디서 확인했는지

```bash
curl -s -w "\nHTTP_STATUS:%{http_code}\n" "https://kusitms.herokuapp.com/api/introductions"
```

2회 호출 모두 동일하게 재현됨(2026-07-24 확인). `GET /admin/introductions`는 토큰이 없어 `401`만 확인했다.

## 왜 지금 우리 코드에서 고치면 안 되는지

공개 endpoint 자체의 서버 응답이라 프론트엔드에서 고칠 수 있는 부분이 아니다. `/admin/introductions`의 `data`도 이 `IntroResponse`와 같은 shape일 것으로 추정하고 있는데(`admin-introductions.md` 참고), 이 500이 데이터 미존재 때문인지 실제 버그인지 확인되지 않아 admin 응답 shape 가정도 아직 실증하지 못한 상태다.

## 언제/누가 해결해야 하는지

백엔드 담당자에게 이 500의 원인(빈 데이터 vs 버그)을 확인 요청한다. `/admin/introductions` 연동을 시작하기 전에 먼저 해소하는 게 좋다 — 이 응답이 정상화돼야 `IntroResponse` shape 가정을 실제로 검증할 수 있다.
