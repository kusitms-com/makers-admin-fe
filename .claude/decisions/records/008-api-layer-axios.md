# 008. API 계층: axios 인터셉터, 응답은 TS 타입, query key 팩토리, 목록 loader

## 상태

- Accepted

## 맥락

- 훅 25곳이 store에서 토큰을 꺼내 API 함수에 넘겼고, 모든 API 함수가 토큰 인자를 받았다.
- 응답은 함수마다 Zod 스키마로 검사했다. 하지만 실제로 잡은 문제는 "Swagger 자체가 바뀐 경우" 정도였고, known-issue 대부분(URL 형식, 요청 쪽 500)은 Zod로 잡을 수 없었다. 스키마 관리 비용이 컸다.
- query key는 도메인마다 상수 하나에 상세 키를 그때그때 조합했다.

## 결정

1. **axios instance**(`src/api/client.ts`의 `apiClient`)를 쓴다. 요청 인터셉터가 기본 주소와 토큰을 붙이고, 응답 인터셉터가 envelope을 검사해 `ApiError`로 바꾸고 401이면 토큰을 갱신해 한 번 재시도한다. 전송은 `adapter: 'fetch'`.
2. 토큰은 인증 store가 `setAuthTokenSource`로 등록한다. client가 store를 import하면 순환 참조가 생기기 때문이다. 공개 API는 `skipAuth: true`.
3. **응답 형태는 TS interface**로 적는다. 런타임 검사는 공통 envelope과 로그인·토큰 갱신 응답(세션을 만드는 값)만 한다. 폼 검증(RHF + Zod)은 그대로다.
4. 도메인별 **query key 팩토리**(`xxxKeys`)와 `xxxQueryOptions()`를 둔다. mutation은 `xxxKeys.all`을 invalidate한다.
5. 목록 라우트는 `clientLoader`에서 `prefetchWhenAuthenticated(xxxQueryOptions())`로 요청만 먼저 시작한다(await 없음).
6. **도메인 폴더 구조**(Tikitak 방식): `src/api/{domain}/`에 `api.ts`(요청 함수)·`queries.ts`(key 팩토리·queryOptions·훅)·`types.ts`(타입)를 둔다. 서버 상태 훅은 `src/hooks`에서 옮겼고, `src/hooks`에는 폼 훅·인증 store 같은 서버 상태가 아닌 훅만 남긴다. 경로 상수(`endpoints.ts`)와 key 전용 파일(`keys.ts`)은 도메인당 API가 적어 따로 두지 않는다.
7. 본문 없는 요청은 `apiRequestVoid()`(Tikitak `requestVoid`), 조회 재시도는 네트워크·5xx만 한 번(bunch `retryPolicy`)으로 한다.

## 근거

- 토큰 처리가 한곳에 모여 API 함수와 훅이 짧아졌다.
- 응답 타입의 근거는 백엔드 Response DTO로 대조한 `.claude/references/api`다. 대조 과정에서 Zod가 오히려 틀린 nullable(예: 블로그 썸네일)로 목록 전체를 깨뜨릴 수 있었음을 확인했다.
- loader가 `queryOptions`를 그대로 재사용해서 설정이 두 곳으로 갈라지지 않는다.

## 대안

- fetch 직접 사용 유지: 기능은 충분했지만 팀이 Tikitak과 같은 axios 인터셉터 구조를 택했다.
- 응답 Zod 유지: 계약이 바뀌면 경계에서 바로 실패하는 장점이 있지만, 관리 비용 대비 이득이 작았다.
- loader에서 `ensureQueryData`를 await: 데이터가 올 때까지 이전 화면이 남아 별도 전역 진행 표시가 필요해 택하지 않았다.
- zustand persist로 토큰 저장: 액세스 토큰을 storage에 두면 XSS에 노출되고, 리프레시 토큰만 옮기면 이득이 작다. 리프레시 토큰을 httpOnly 쿠키로 받는 방식이 더 안전하지만 백엔드 변경이 필요하다.

## 영향

- 새 API 함수는 `apiRequest<T>({ method, path, body })`로 만들고, 응답 타입은 레퍼런스 문서와 함께 갱신한다. 0건 목록은 서버가 `data`를 생략하므로 `data ?? []`로 받는다.
- 조회 훅은 `useIsAuthenticated()`로 로그인 상태일 때만 실행한다. 로그인 화면 배경에도 관리자 화면이 렌더링되기 때문이다.
- 관련: `.claude/rules/data-fetching.md`, `src/providers/queryClient.ts`, 007(테스트 환경)
