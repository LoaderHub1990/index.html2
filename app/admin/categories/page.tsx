"use client"
import { useEffect, useState } from 'react'

interface Category { id: string; name: string; description: string; createdAt: string }
const emptyForm = { name:'', description:'' }

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([])
  const [modal, setModal] = useState<null|'add'|'edit'|'delete'>(null)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)

  const load = () => fetch('/api/categories').then(r=>r.json()).then(setCats)
  useEffect(() => {
    void load()
  }, [])
  const showToast = (msg:string,type:'ok'|'err'='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  const openAdd = () => { setForm(emptyForm); setModal('add') }
  const openEdit = (c: Category) => { setEditId(c.id); setForm({name:c.name,description:c.description}); setModal('edit') }
  const openDelete = (id:string) => { setDeleteId(id); setModal('delete') }

  async function save() {
    const url = modal==='edit' ? `/api/categories/${editId}` : '/api/categories'
    const res = await fetch(url,{method:modal==='edit'?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    if(res.ok){showToast('บันทึกแล้ว');setModal(null);load()}else showToast('เกิดข้อผิดพลาด','err')
  }
  async function del() {
    const res = await fetch(`/api/categories/${deleteId}`,{method:'DELETE'})
    if(res.ok){showToast('ลบแล้ว');setModal(null);load()}else showToast('เกิดข้อผิดพลาด','err')
  }

  return (
    <div className="admin-page">
      <div className="admin-page-hd">
        <h1>หมวดหมู่</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg className="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>เพิ่มหมวดหมู่
        </button>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>ชื่อ</th><th>คำอธิบาย</th><th>วันที่สร้าง</th><th>จัดการ</th></tr></thead>
          <tbody>
            {cats.length===0 ? <tr><td colSpan={4} className="tbl-empty">ยังไม่มีหมวดหมู่</td></tr>
            : cats.map(c=>(
              <tr key={c.id}>
                <td style={{fontWeight:600}}>{c.name}</td>
                <td style={{color:'var(--text-2)',fontSize:13}}>{c.description}</td>
                <td className="mono">{new Date(c.createdAt).toLocaleDateString('th-TH')}</td>
                <td><div className="actions">
                  <button className="btn btn-sm" onClick={()=>openEdit(c)}>แก้ไข</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>openDelete(c.id)}>ลบ</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="modal" style={{maxWidth:400}}>
            <div className="modal-hd">
              <h3>{modal==='edit'?'แก้ไขหมวดหมู่':'เพิ่มหมวดหมู่'}</h3>
              <button className="modal-close" onClick={()=>setModal(null)}><svg className="i" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="form-field"><label>ชื่อหมวดหมู่</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="เช่น KEY, SCRIPT"/></div>
            <div className="form-field"><label>คำอธิบาย</label><textarea className="textarea" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="อธิบายสั้นๆ"/></div>
            <div className="form-actions">
              <button className="btn" onClick={()=>setModal(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={save}>บันทึก</button>
            </div>
          </div>
        </div>
      )}
      {modal==='delete' && (
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="modal" style={{maxWidth:340}}>
            <div className="modal-hd"><h3>ยืนยันการลบ</h3></div>
            <p style={{fontSize:14,color:'var(--text-2)',marginBottom:20}}>ลบหมวดหมู่นี้? สินค้าที่ใช้หมวดหมู่นี้จะไม่มีหมวดหมู่</p>
            <div className="form-actions" style={{borderTop:'none',paddingTop:0,marginTop:0}}>
              <button className="btn" onClick={()=>setModal(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={del}>ลบ</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="toast-root"><div className={`toast ${toast.type}`}>{toast.msg}</div></div>}
    </div>
  )
}
