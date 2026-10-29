import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const products = db.products.all()
  const categories = db.categories.all()
  const orders = db.orders.all()
  const reviews = db.reviews.all()

  const completedOrders = orders.filter(o => o.status === 'completed')
  const totalRevenue = completedOrders.reduce((s, o) => s + o.price, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const recentOrders = orders.slice().reverse().slice(0, 10)

  return NextResponse.json({
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: orders.length,
    totalRevenue,
    totalReviews: reviews.length,
    pendingOrders,
    recentOrders,
  })
}
