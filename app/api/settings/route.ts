import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(db.settings.get())
}

export async function PUT(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const current = db.settings.get()
  db.settings.save({ ...current, ...body })
  return NextResponse.json(db.settings.get())
}
