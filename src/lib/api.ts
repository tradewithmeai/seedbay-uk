/*
 * Client for the SeedBay API (public/api/*.php on Krystal).
 *
 * In the browser the API is same-origin, so the base is empty and the session
 * cookie travels with the request. During the build there is no origin, so
 * SEEDBAY_API_BASE points the pre-render at the live site.
 */

export const API_BASE =
  typeof window === 'undefined'
    ? (process.env.SEEDBAY_API_BASE || 'https://seedbay.co.uk').replace(/\/$/, '')
    : ''

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  /** Let the caller treat an expected status (e.g. 404) as a null result. */
  allowStatus?: number[]
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  const { method = 'GET', body, allowStatus = [] } = options

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    // The session lives in a HttpOnly cookie on the same origin.
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (allowStatus.includes(response.status)) return null

  // A PHP fatal or an HTML error page would blow up .json(); surface it as a
  // clean ApiError rather than a parser stack trace in the user's face.
  let payload: Record<string, unknown> = {}
  try {
    payload = (await response.json()) as Record<string, unknown>
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, 'bad_response', 'The server sent something unreadable.')
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof payload.error === 'string' ? payload.error : 'unknown',
      typeof payload.message === 'string' ? payload.message : 'Something went wrong.'
    )
  }

  return payload as T
}
