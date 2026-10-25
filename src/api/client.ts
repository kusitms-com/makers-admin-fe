import { z } from 'zod'

const responseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.unknown(),
})

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

interface ApiRequestOptions {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  readonly path: `/${string}`
  readonly body?: unknown
  readonly accessToken?: string
  readonly refreshAccessToken?: () => Promise<string>
  readonly signal?: AbortSignal
}

export async function apiRequest<T>(
  { method, path, body, accessToken, refreshAccessToken, signal }: ApiRequestOptions,
  schema: z.ZodType<T>,
): Promise<T> {
  let requestBody: BodyInit | undefined

  if (body instanceof FormData) {
    requestBody = body
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body)
  }

  const baseUrl = z.url().parse(import.meta.env.VITE_API_BASE_URL)
  async function send(token: string | undefined): Promise<T> {
    const headers = new Headers()
    if (body !== undefined && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(new URL(path, baseUrl), {
      method,
      headers,
      body: requestBody,
      signal,
    })
    let payload: unknown
    try {
      payload = await response.json()
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ApiError(response.status, undefined, '서버 응답을 확인할 수 없습니다.')
      }
      throw error
    }
    const parsed = responseSchema.safeParse(payload)

    if (!parsed.success) {
      throw new ApiError(response.status, undefined, '서버 응답을 확인할 수 없습니다.')
    }
    if (!response.ok || parsed.data.code !== 200) {
      throw new ApiError(response.status, parsed.data.code, parsed.data.message)
    }

    return schema.parse(parsed.data.data)
  }

  try {
    return await send(accessToken)
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || (error.status === 200 && error.code === 401)) &&
      accessToken &&
      refreshAccessToken
    ) {
      return send(await refreshAccessToken())
    }
    throw error
  }
}
