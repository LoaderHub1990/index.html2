import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const adminRecord = db.admin.get()
  let valid = false

  if (adminRecord) {
    valid = username === adminRecord.username && await bcrypt.compare(password, adminRecord.passwordHash)
  } else {
    // fall back to env vars
    valid = username === (process.env.ADMIN_USERNAME || 'admin') &&
            password === (process.env.ADMIN_PASSWORD || 'admin123')
  }

  if (!valid) {
    return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
  }

  const token = await signToken({ username, role: 'admin' })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
