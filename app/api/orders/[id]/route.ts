import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const orders = db.orders.all()
  const idx = orders.findIndex(x => x.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  orders[idx] = {
    ...orders[idx],
    status: body.status ?? orders[idx].status,
    deliveredKey: body.deliveredKey ?? orders[idx].deliveredKey,
  }
  db.orders.save(orders)
  return NextResponse.json(orders[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  db.orders.save(db.orders.all().filter(x => x.id !== params.id))
  return NextResponse.json({ ok: true })
}
