# 데이터 패칭 규칙

## 서버 상태

- 서버 데이터에는 TanStack Query v5를 사용합니다.
- `useState + useEffect`로 서버 데이터를 직접 fetch하지 않습니다.
- query key는 `src/api/{domain}/queries.ts`에 도메인별 팩토리(`xxxKeys = { all, list(), detail(id) }`)와 `xxxQueryOptions()`로 둡니다. mutation은 `xxxKeys.all`을 invalidate합니다.
- 조회 훅은 `useIsAuthenticated()`로 로그인 상태일 때만 실행합니다(로그인 화면 배경에서도 관리자 화면이 렌더링됨).
- 목록 라우트는 `clientLoader`에서 `prefetchWhenAuthenticated(xxxQueryOptions())`로 요청만 먼저 시작합니다. await하지 않습니다.
- 생성, 수정, 삭제, 승인, 반려, 상태 변경에는 mutation을 사용합니다.

## API 계층

- 도메인마다 `src/api/{domain}/` 폴더에 `api.ts`(요청 함수), `queries.ts`(key 팩토리·queryOptions·훅), `types.ts`(요청·응답 타입)를 둡니다. 폴더 이름은 kebab-case(`blog-reviews`)입니다.
- 응답 본문이 의미 없는 요청(등록·수정·삭제)은 `apiRequestVoid()`로 보내 `Promise<void>`를 돌려줍니다.
- 조회 재시도는 네트워크 오류와 5xx만 한 번 합니다(`src/providers/queryClient.ts`의 `shouldRetryQuery`). 4xx는 다시 보내도 결과가 같아 재시도하지 않습니다.
- 추측한 엔드포인트 경로를 하드코딩하지 않습니다. Swagger 또는 `.claude/references/api`로 확인합니다.
- 요청은 `src/api/client.ts`의 `apiRequest<T>()`(axios `apiClient`)로 보냅니다. 기본 주소·토큰·envelope 검사·401 재시도는 인터셉터가 맡으므로 API 함수에서 토큰을 다루지 않습니다. 공개 API는 `skipAuth: true`.
- 응답 타입은 TS interface로 적고, 근거는 `.claude/references/api`입니다. 응답을 Zod로 검사하지 않습니다(예외: 공통 envelope, 로그인·토큰 갱신 응답). null 가능 여부를 정확히 적습니다.
- 0건 목록은 서버가 `data` 키를 생략하므로 `data ?? []`로 받습니다.
- 근거: `.claude/decisions/records/008-api-layer-axios.md`

## 폼

- React Hook Form과 Zod를 함께 사용합니다.
- schema가 재사용되지 않으면 form 근처에 둡니다.
- 가능하면 서버 검증 에러를 field error로 매핑합니다.

## 클라이언트 상태

- Zustand는 UI preference, 선택된 workspace, 로컬 workflow 상태처럼 클라이언트 전용 상태에만 사용합니다.
- TanStack Query 데이터를 Zustand로 복제하지 않습니다.
