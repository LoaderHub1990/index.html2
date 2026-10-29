import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { oldPassword, newPassword } = await req.json()
  const adminRecord = db.admin.get()

  if (adminRecord) {
    const ok = await bcrypt.compare(oldPassword, adminRecord.passwordHash)
    if (!ok) return NextResponse.json({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' }, { status: 400 })
  } else {
    if (oldPassword !== (process.env.ADMIN_PASSWORD || 'admin123')) {
      return NextResponse.json({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' }, { status: 400 })
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  const username = adminRecord?.username || process.env.ADMIN_USERNAME || 'admin'
  db.admin.save({ username, passwordHash })
  return NextResponse.json({ ok: true })
}
