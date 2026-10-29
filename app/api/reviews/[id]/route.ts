import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const reviews = db.reviews.all()
  const idx = reviews.findIndex(x => x.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  reviews[idx] = { ...reviews[idx], visible: body.visible !== undefined ? body.visible : reviews[idx].visible }
  db.reviews.save(reviews)
  return NextResponse.json(reviews[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  db.reviews.save(db.reviews.all().filter(x => x.id !== params.id))
  return NextResponse.json({ ok: true })
}
