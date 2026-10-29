import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE = 'admin_token'
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret')

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload
  } catch { return null }
}

export async function getAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return null
  return await verifyToken(token)
}

export { COOKIE }
