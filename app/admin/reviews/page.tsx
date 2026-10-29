"use client"
import { useEffect, useState } from 'react'

interface Review { id:string; productName:string; author:string; rating:number; comment:string; visible:boolean; createdAt:string }

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)

  const load = () => fetch('/api/reviews').then(r=>r.json()).then(setReviews)
  useEffect(load, [])
  const showToast = (msg:string,type:'ok'|'err'='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  async function toggle(r: Review) {
    const res = await fetch(`/api/reviews/${r.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({visible:!r.visible})})
    if(res.ok){showToast(!r.visible?'แสดงรีวิวแล้ว':'ซ่อนรีวิวแล้ว');load()}else showToast('เกิดข้อผิดพลาด','err')
  }
  async function del(id:string) {
    const res = await fetch(`/api/reviews/${id}`,{method:'DELETE'})
    if(res.ok){showToast('ลบแล้ว');load()}else showToast('เกิดข้อผิดพลาด','err')
  }

  const filtered = reviews.filter(r => r.author.toLowerCase().includes(search.toLowerCase()) || r.productName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="admin-page">
      <div className="admin-page-hd"><h1>รีวิว</h1></div>
      <div className="toolbar">
        <div className="search-wrap">
          <svg className="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="ค้นหา..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <span style={{marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-3)'}}>{filtered.length} รายการ</span>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>ผู้รีวิว</th><th>สินค้า</th><th>คะแนน</th><th>ความคิดเห็น</th><th>สถานะ</th><th>วันที่</th><th>จัดการ</th></tr></thead>
          <tbody>
            {filtered.length===0 ? <tr><td colSpan={7} className="tbl-empty">ไม่มีรีวิว</td></tr>
            : filtered.map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:500}}>{r.author}</td>
                <td style={{color:'var(--text-2)',fontSize:13}}>{r.productName}</td>
                <td style={{fontSize:14}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</td>
                <td style={{maxWidth:240,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-2)',fontSize:13}}>{r.comment}</td>
                <td><span className={`badge ${r.visible?'badge-green':'badge-gray'}`}>{r.visible?'แสดง':'ซ่อน'}</span></td>
                <td className="mono">{new Date(r.createdAt).toLocaleDateString('th-TH')}</td>
                <td><div className="actions">
                  <button className="btn btn-sm" onClick={()=>toggle(r)}>{r.visible?'ซ่อน':'แสดง'}</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>del(r.id)}>ลบ</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <div className="toast-root"><div className={`toast ${toast.type}`}>{toast.msg}</div></div>}
    </div>
  )
}
