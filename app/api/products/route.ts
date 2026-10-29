import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(db.products.all())
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const products = db.products.all()
  const product = {
    id: uuid(),
    name: body.name || '',
    description: body.description || '',
    price: Number(body.price) || 0,
    categoryId: body.categoryId || '',
    image: body.image || '',
    deliveryType: body.deliveryType || 'manual',
    keys: Array.isArray(body.keys) ? body.keys : [],
    stock: body.deliveryType === 'auto' ? (Array.isArray(body.keys) ? body.keys.length : 0) : Number(body.stock) || 0,
    totalSold: 0,
    createdAt: new Date().toISOString(),
    active: body.active !== false,
  }
  products.push(product)
  db.products.save(products)
  return NextResponse.json(product, { status: 201 })
}
