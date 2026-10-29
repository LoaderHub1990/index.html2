"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const nav = [
  { href:'/admin', label:'Dashboard', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href:'/admin/products', label:'สินค้า', icon:'M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0' },
  { href:'/admin/categories', label:'หมวดหมู่', icon:'m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { href:'/admin/orders', label:'ออเดอร์', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { href:'/admin/reviews', label:'รีวิว', icon:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { href:'/admin/settings', label:'ตั้งค่า', icon:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="admin-sidebar">
      <div className="brand" style={{padding:'16px'}}>
        <span className="brand-icon">
          <svg style={{width:14,height:14,stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',fill:'none'}}>
            <use href="#shield"/>
          </svg>
        </span>
        <b>Admin Panel</b>
      </div>

      <nav className="admin-nav">
        <span className="admin-nav-group">เมนูหลัก</span>
        {nav.map(item => {
          const exact = item.href === '/admin'
          const active = exact ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} className={`admin-nav-item${active ? ' active' : ''}`}>
              <svg style={{width:14,height:14,stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',fill:'none',flexShrink:0}}>
                <path d={item.icon}/>
              </svg>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" target="_blank" className="admin-nav-item" style={{marginBottom:4}}>
          <svg style={{width:14,height:14,stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',fill:'none'}}>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
          ดูหน้าร้าน
        </Link>
        <button className="admin-nav-item" onClick={logout} style={{color:'#f87171'}}>
          <svg style={{width:14,height:14,stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',fill:'none'}}>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
