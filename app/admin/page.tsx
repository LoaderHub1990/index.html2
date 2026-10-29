"use client"
import { useEffect, useState } from 'react'

interface Stats {
  totalProducts: number; totalCategories: number; totalOrders: number
  totalRevenue: number; totalReviews: number; pendingOrders: number
  recentOrders: Array<{ id: string; productName: string; buyerAlias: string; price: number; status: string; createdAt: string }>
}

function statusBadge(s: string) {
  if (s === 'completed') return <span className="badge badge-green">สำเร็จ</span>
  if (s === 'pending') return <span className="badge badge-yellow">รอดำเนินการ</span>
  return <span className="badge badge-red">ยกเลิก</span>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats)
  }, [])

  if (!stats) return <div className="admin-page" style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-3)'}}>กำลังโหลด...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-hd">
        <h1>Dashboard</h1>
        <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-3)'}}>{new Date().toLocaleDateString('th-TH',{dateStyle:'full'})}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="s-label">สินค้าทั้งหมด</div><div className="s-value">{stats.totalProducts}</div></div>
        <div className="stat-card"><div className="s-label">ออเดอร์ทั้งหมด</div><div className="s-value">{stats.totalOrders}</div><div className="s-sub">รอดำเนินการ {stats.pendingOrders}</div></div>
        <div className="stat-card"><div className="s-label">รายได้รวม</div><div className="s-value">฿{stats.totalRevenue.toLocaleString()}</div></div>
        <div className="stat-card"><div className="s-label">รีวิว</div><div className="s-value">{stats.totalReviews}</div></div>
      </div>

      <div style={{marginBottom:24}}>
        <h2 style={{fontFamily:'var(--font-mono)',fontSize:15,fontWeight:600,letterSpacing:'-.02em',marginBottom:14}}>ออเดอร์ล่าสุด</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th><th>สินค้า</th><th>ผู้ซื้อ</th><th>ราคา</th><th>สถานะ</th><th>วันที่</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="tbl-empty">ยังไม่มีออเดอร์</td></tr>
              ) : stats.recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="mono">#{o.id.slice(-6)}</td>
                  <td>{o.productName}</td>
                  <td className="mono">{o.buyerAlias}</td>
                  <td className="mono">฿{o.price}</td>
                  <td>{statusBadge(o.status)}</td>
                  <td className="mono">{new Date(o.createdAt).toLocaleDateString('th-TH')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
