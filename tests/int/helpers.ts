import config from '@payload-config'
import { createLocalReq, getPayload, handleEndpoints, type Payload } from 'payload'

export const getTestPayload = async (): Promise<Payload> => getPayload({ config })

export const PASSWORD = 'Correct-Horse-Battery-9'

/** Calls the real REST API (same handler Next.js uses) with an optional JWT. */
export const rest = async (
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  { token, body }: { token?: string; body?: unknown } = {},
) => {
  const request = new Request(`http://localhost:3000/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  const response = await handleEndpoints({ config, request })
  const json = await response.json().catch(() => ({}))
  return { status: response.status, json }
}

export const login = async (payload: Payload, email: string) => {
  const result = await payload.login({ collection: 'users', data: { email, password: PASSWORD } })
  if (!result.token) throw new Error('Login did not return a token')
  return { token: result.token, user: result.user }
}

export const reqAs = async (payload: Payload, user: Record<string, unknown> | null) =>
  createLocalReq({ user: user ? ({ ...user, collection: 'users' } as never) : undefined }, payload)
