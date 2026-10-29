"use client"
import { useEffect, useState } from 'react'

interface Order {
  id: string; productId: string; productName: string; buyerAlias: string
  price: number; status: 'pending'|'completed'|'cancelled'; deliveredKey?: string; note?: string; createdAt: string
}

const STATUS_MAP: Record<string,string> = { pending:'รอดำเนินการ', completed:'สำเร็จ', cancelled:'ยกเลิก' }

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'all'|'pending'|'completed'|'cancelled'>('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<Order|null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editKey, setEditKey] = useState('')
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)

  const load = () => fetch('/api/orders').then(r=>r.json()).then(setOrders)
  useEffect(load, [])
  const showToast = (msg:string,type:'ok'|'err'='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  const openEdit = (o:Order) => { setModal(o); setEditStatus(o.status); setEditKey(o.deliveredKey||'') }

  async function saveOrder() {
    if(!modal) return
    const res = await fetch(`/api/orders/${modal.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:editStatus,deliveredKey:editKey})})
    if(res.ok){showToast('อัปเดตแล้ว');setModal(null);load()}else showToast('เกิดข้อผิดพลาด','err')
  }

  async function deleteOrder(id:string) {
    const res = await fetch(`/api/orders/${id}`,{method:'DELETE'})
    if(res.ok){showToast('ลบแล้ว');load()}else showToast('เกิดข้อผิดพลาด','err')
  }

  let filtered = orders
  if(filter!=='all') filtered = filtered.filter(o=>o.status===filter)
  if(search) filtered = filtered.filter(o=>o.productName.toLowerCase().includes(search.toLowerCase())||o.buyerAlias.toLowerCase().includes(search.toLowerCase()))

  const statusBadge = (s:string) => {
    if(s==='completed') return <span className="badge badge-green">สำเร็จ</span>
    if(s==='pending') return <span className="badge badge-yellow">รอดำเนินการ</span>
    return <span className="badge badge-red">ยกเลิก</span>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-hd"><h1>ออเดอร์</h1></div>

      <div className="toolbar">
        <div className="search-wrap">
          <svg className="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="ค้นหา..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {(['all','pending','completed','cancelled'] as const).map(s=>(
          <button key={s} className={`btn btn-sm${filter===s?' btn-primary':''}`} onClick={()=>setFilter(s)}>
            {s==='all'?'ทั้งหมด':STATUS_MAP[s]}
          </button>
        ))}
        <span style={{marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-3)'}}>{filtered.length} รายการ</span>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>ID</th><th>สินค้า</th><th>ผู้ซื้อ</th><th>ราคา</th><th>สถานะ</th><th>คีย์</th><th>วันที่</th><th>จัดการ</th></tr></thead>
          <tbody>
            {filtered.length===0 ? <tr><td colSpan={8} className="tbl-empty">ไม่มีออเดอร์</td></tr>
            : filtered.map(o=>(
              <tr key={o.id}>
                <td className="mono">#{o.id.slice(-6)}</td>
                <td style={{fontWeight:500}}>{o.productName}</td>
                <td className="mono">{o.buyerAlias}</td>
                <td className="mono">฿{o.price}</td>
                <td>{statusBadge(o.status)}</td>
                <td className="mono" style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.deliveredKey||'—'}</td>
                <td className="mono">{new Date(o.createdAt).toLocaleDateString('th-TH')}</td>
                <td><div className="actions">
                  <button className="btn btn-sm" onClick={()=>openEdit(o)}>แก้ไข</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>deleteOrder(o.id)}>ลบ</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-hd">
              <h3>จัดการออเดอร์ #{modal.id.slice(-6)}</h3>
              <button className="modal-close" onClick={()=>setModal(null)}><svg className="i" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'12px 14px',marginBottom:16,fontSize:13}}>
              <div style={{marginBottom:4}}><b>{modal.productName}</b></div>
              <div className="mono" style={{color:'var(--text-2)'}}>ผู้ซื้อ: {modal.buyerAlias} | ราคา: ฿{modal.price}</div>
              {modal.note && <div style={{marginTop:4,fontSize:12,color:'var(--text-3)'}}>หมายเหตุ: {modal.note}</div>}
            </div>
            <div className="form-field">
              <label>สถานะ</label>
              <select className="select" value={editStatus} onChange={e=>setEditStatus(e.target.value)}>
                <option value="pending">รอดำเนินการ</option>
                <option value="completed">สำเร็จ</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
            <div className="form-field">
              <label>คีย์ที่ส่ง (ถ้ามี)</label>
              <input className="input" value={editKey} onChange={e=>setEditKey(e.target.value)} placeholder="KEY-XXXX-XXXX" style={{fontFamily:'var(--font-mono)'}}/>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={()=>setModal(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={saveOrder}>บันทึก</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="toast-root"><div className={`toast ${toast.type}`}>{toast.msg}</div></div>}
    </div>
  )
}
