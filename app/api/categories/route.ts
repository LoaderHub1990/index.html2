import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(db.categories.all())
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const cats = db.categories.all()
  const cat = { id: uuid(), name: body.name || '', description: body.description || '', createdAt: new Date().toISOString() }
  cats.push(cat)
  db.categories.save(cats)
  return NextResponse.json(cat, { status: 201 })
}
