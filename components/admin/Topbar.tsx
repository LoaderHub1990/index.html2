"use client"
import { usePathname } from 'next/navigation'

const titles: Record<string,string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'สินค้า',
  '/admin/categories': 'หมวดหมู่',
  '/admin/orders': 'ออเดอร์',
  '/admin/reviews': 'รีวิว',
  '/admin/settings': 'ตั้งค่าร้าน',
}

export default function Topbar() {
  const pathname = usePathname()
  const title = titles[pathname] || 'Admin'
  return (
    <div className="admin-topbar">
      <span className="admin-topbar-title">{title}</span>
    </div>
  )
}
