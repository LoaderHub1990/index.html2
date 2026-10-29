import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const cats = db.categories.all()
  const idx = cats.findIndex(x => x.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  cats[idx] = { ...cats[idx], name: body.name ?? cats[idx].name, description: body.description ?? cats[idx].description }
  db.categories.save(cats)
  return NextResponse.json(cats[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  db.categories.save(db.categories.all().filter(x => x.id !== params.id))
  return NextResponse.json({ ok: true })
}
