import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function GET() {
  const orders = db.orders.all().slice().reverse()
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const products = db.products.all()
  const prod = products.find(p => p.id === body.productId)
  if (!prod) return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 })
  if (prod.stock < 1) return NextResponse.json({ error: 'สินค้าหมดแล้ว' }, { status: 400 })

  let deliveredKey: string | undefined
  let status: 'completed' | 'pending' = 'pending'

  if (prod.deliveryType === 'auto' && prod.keys.length > 0) {
    deliveredKey = prod.keys[0]
    const idx = products.findIndex(p => p.id === prod.id)
    products[idx].keys = products[idx].keys.slice(1)
    products[idx].stock = products[idx].keys.length
    products[idx].totalSold += 1
    db.products.save(products)
    status = 'completed'
  } else {
    const idx = products.findIndex(p => p.id === prod.id)
    products[idx].stock -= 1
    products[idx].totalSold += 1
    db.products.save(products)
  }

  const order = {
    id: uuid(),
    productId: prod.id,
    productName: prod.name,
    productImage: prod.image,
    buyerAlias: body.buyerAlias || 'anon***',
    price: prod.price,
    status,
    deliveredKey,
    note: body.note || '',
    createdAt: new Date().toISOString(),
  }

  const orders = db.orders.all()
  orders.push(order)
  db.orders.save(orders)

  return NextResponse.json({ orderId: order.id.slice(-6), key: deliveredKey })
}
