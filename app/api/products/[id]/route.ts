import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const p = db.products.all().find(x => x.id === params.id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(p)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const products = db.products.all()
  const idx = products.findIndex(x => x.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const keys = Array.isArray(body.keys) ? body.keys : products[idx].keys
  products[idx] = {
    ...products[idx],
    name: body.name ?? products[idx].name,
    description: body.description ?? products[idx].description,
    price: body.price !== undefined ? Number(body.price) : products[idx].price,
    categoryId: body.categoryId ?? products[idx].categoryId,
    image: body.image ?? products[idx].image,
    deliveryType: body.deliveryType ?? products[idx].deliveryType,
    keys,
    stock: body.deliveryType === 'auto' ? keys.length : (body.stock !== undefined ? Number(body.stock) : products[idx].stock),
    active: body.active !== undefined ? body.active : products[idx].active,
  }
  db.products.save(products)
  return NextResponse.json(products[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const products = db.products.all().filter(x => x.id !== params.id)
  db.products.save(products)
  return NextResponse.json({ ok: true })
}
