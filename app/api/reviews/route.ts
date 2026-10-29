import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function GET() {
  return NextResponse.json(db.reviews.all().slice().reverse())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const review = {
    id: uuid(),
    productId: body.productId || '',
    productName: body.productName || '',
    author: body.author || 'Anonymous',
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    comment: body.comment || '',
    visible: true,
    createdAt: new Date().toISOString(),
  }
  const reviews = db.reviews.all()
  reviews.push(review)
  db.reviews.save(reviews)
  return NextResponse.json(review, { status: 201 })
}
