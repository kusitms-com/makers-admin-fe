import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { z } from 'zod'

declare module 'axios' {
  interface AxiosRequestConfig {
    // 토큰 없이 보낼 공개 API(로그인·토큰 갱신·현재 기수)
    skipAuth?: boolean
    // 등록된 토큰 대신 쓸 값. 로그아웃처럼 store 세션을 먼저 비운 뒤 요청할 때만 넘긴다.
    accessToken?: string
    refreshAccessToken?: () => Promise<string>
    // 401 재시도는 한 번만 한다.
    retriedWithFreshToken?: boolean
  }
}

// 모든 응답이 공통으로 쓰는 envelope만 검사한다. data의 형태는 각 API 함수의 TS 타입이 근거다(.claude/references/api).
const envelopeSchema = z.object({
  code: z.number(),
  message: z.string(),
  // 서버는 data에 @JsonInclude(NON_DEFAULT)를 붙여 null뿐 아니라 빈 목록([])·0일 때도 data 키를 생략한다.
  data: z.unknown().optional(),
})

type Envelope = z.infer<typeof envelopeSchema>

const UNREADABLE_RESPONSE_MESSAGE = '서버 응답을 확인할 수 없습니다.'

export class ApiError extends Error {
  readonly name = 'ApiError'
  readonly status: number
  readonly code: number | undefined

  constructor(status: number, code: number | undefined, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

// 서버에 닿지 못한 오류(네트워크 끊김 등). 응답이 있는 오류는 모두 ApiError로 바뀐다.
export function isNetworkError(error: unknown) {
  return axios.isAxiosError(error) && !error.response
}

interface AuthTokenSource {
  readonly getAccessToken: () => string | undefined
  readonly refreshAccessToken: () => Promise<string>
}

let authTokenSource: AuthTokenSource | undefined

// 인증 store가 자신을 등록한다. client가 store를 직접 import하면 client → store → api/auth → client 순환이 생긴다.
export function setAuthTokenSource(source: AuthTokenSource) {
  authTokenSource = source
}

export const apiClient = axios.create({
  adapter: 'fetch',
  // fetch를 처음 한 번만 찾아 고정하지 않도록 매번 전역 fetch를 쓴다(테스트의 fetch 대체 포함).
  env: { fetch: (...args: Parameters<typeof fetch>) => globalThis.fetch(...args) },
})

apiClient.interceptors.request.use((config) => {
  config.baseURL = z.url().parse(import.meta.env.VITE_API_BASE_URL)
  const token =
    config.accessToken ?? (config.skipAuth ? undefined : authTokenSource?.getAccessToken())
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

function toApiError(status: number, payload: unknown) {
  const parsed = envelopeSchema.safeParse(payload)
  return parsed.success
    ? new ApiError(status, parsed.data.code, parsed.data.message)
    : new ApiError(status, undefined, UNREADABLE_RESPONSE_MESSAGE)
}

// 토큰을 보냈는데 401이면 토큰을 갱신해 한 번만 다시 보낸다. 서버는 HTTP 200에 본문 code 401로 보내기도 한다.
async function retryWithFreshToken(
  error: ApiError,
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse<Envelope>> {
  const refresh =
    config.refreshAccessToken ?? (config.skipAuth ? undefined : authTokenSource?.refreshAccessToken)
  const isUnauthorized = error.status === 401 || (error.status === 200 && error.code === 401)

  if (
    !isUnauthorized ||
    config.retriedWithFreshToken ||
    !config.headers.has('Authorization') ||
    !refresh
  ) {
    throw error
  }
  return apiClient.request<Envelope>({
    ...config,
    accessToken: await refresh(),
    retriedWithFreshToken: true,
  })
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const parsed = envelopeSchema.safeParse(response.data)
    if (!parsed.success) {
      throw new ApiError(response.status, undefined, UNREADABLE_RESPONSE_MESSAGE)
    }
    if (parsed.data.code === 200) return response
    return retryWithFreshToken(toApiError(response.status, response.data), response.config)
  },
  (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response || !error.config) throw error
    return retryWithFreshToken(toApiError(error.response.status, error.response.data), error.config)
  },
)

interface ApiRequestOptions {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  readonly path: `/${string}`
  readonly body?: unknown
  readonly skipAuth?: boolean
  readonly accessToken?: string
  readonly refreshAccessToken?: () => Promise<string>
  readonly signal?: AbortSignal
}

// envelope을 벗겨 data만 돌려준다. data가 없는 성공 응답이면 undefined다.
export async function apiRequest<T>({ method, path, body, ...config }: ApiRequestOptions) {
  const response = await apiClient.request<Envelope>({ method, url: path, data: body, ...config })
  return response.data.data as T
}

// 응답 본문이 의미 없는 요청(등록·수정·삭제 등). 성공하면 아무것도 돌려주지 않는다.
export async function apiRequestVoid(options: ApiRequestOptions): Promise<void> {
  await apiRequest(options)
}
