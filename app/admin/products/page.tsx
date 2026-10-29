"use client"
import { useEffect, useState } from 'react'

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; description: string; price: number
  categoryId: string; image: string; deliveryType: 'auto'|'manual'
  keys: string[]; stock: number; totalSold: number; active: boolean
}

const empty: Omit<Product,'id'|'totalSold'> = {
  name:'',description:'',price:0,categoryId:'',image:'',
  deliveryType:'manual',keys:[],stock:0,active:true
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<null|'add'|'edit'|'delete'>(null)
  const [form, setForm] = useState<Omit<Product,'id'|'totalSold'>>(empty)
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [keysText, setKeysText] = useState('')
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)

  const load = () => {
    fetch('/api/products').then(r=>r.json()).then(setProducts)
    fetch('/api/categories').then(r=>r.json()).then(setCategories)
  }
  useEffect(() => {
    void load()
  }, [])

  const showToast = (msg: string, type: 'ok'|'err' = 'ok') => {
    setToast({msg,type})
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd = () => { setForm(empty); setKeysText(''); setModal('add') }
  const openEdit = (p: Product) => {
    setEditId(p.id)
    setForm({name:p.name,description:p.description,price:p.price,categoryId:p.categoryId,
      image:p.image,deliveryType:p.deliveryType,keys:p.keys,stock:p.stock,active:p.active})
    setKeysText(p.keys.join('\n'))
    setModal('edit')
  }
  const openDelete = (id: string) => { setDeleteId(id); setModal('delete') }

  async function saveProduct() {
    const keys = keysText.split('\n').map(s=>s.trim()).filter(Boolean)
    const body = { ...form, keys, stock: form.deliveryType==='auto' ? keys.length : Number(form.stock) }
    const url = modal==='edit' ? `/api/products/${editId}` : '/api/products'
    const method = modal==='edit' ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    if (res.ok) { showToast(modal==='edit'?'อัปเดตแล้ว':'เพิ่มสินค้าแล้ว'); setModal(null); load() }
    else showToast('เกิดข้อผิดพลาด','err')
  }

  async function deleteProduct() {
    const res = await fetch(`/api/products/${deleteId}`, { method:'DELETE' })
    if (res.ok) { showToast('ลบแล้ว'); setModal(null); load() }
    else showToast('เกิดข้อผิดพลาด','err')
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const catName = (id: string) => categories.find(c=>c.id===id)?.name || '—'

  return (
    <div className="admin-page">
      <div className="admin-page-hd">
        <h1>สินค้า</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg className="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>เพิ่มสินค้า
        </button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <svg className="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="ค้นหาสินค้า..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <span style={{marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-3)'}}>{filtered.length} รายการ</span>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr><th>ชื่อสินค้า</th><th>หมวดหมู่</th><th>ราคา</th><th>สต็อก</th><th>ส่ง</th><th>ขายแล้ว</th><th>สถานะ</th><th>จัดการ</th></tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={8} className="tbl-empty">ไม่มีสินค้า</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{fontWeight:500}}>{p.name}</td>
                <td><span className="badge badge-gray">{catName(p.categoryId)}</span></td>
                <td className="mono">฿{p.price}</td>
                <td className="mono">{p.stock}</td>
                <td><span className={`badge ${p.deliveryType==='auto'?'badge-green':'badge-gray'}`}>{p.deliveryType==='auto'?'Auto':'Manual'}</span></td>
                <td className="mono">{p.totalSold}</td>
                <td><span className={`badge ${p.active?'badge-green':'badge-red'}`}>{p.active?'เปิด':'ปิด'}</span></td>
                <td>
                  <div className="actions">
                    <button className="btn btn-sm" onClick={()=>openEdit(p)}>แก้ไข</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>openDelete(p.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="modal">
            <div className="modal-hd">
              <h3>{modal==='edit'?'แก้ไขสินค้า':'เพิ่มสินค้า'}</h3>
              <button className="modal-close" onClick={()=>setModal(null)}>
                <svg className="i" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="form-field">
              <label>ชื่อสินค้า</label>
              <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อสินค้า"/>
            </div>
            <div className="form-field">
              <label>คำอธิบาย</label>
              <textarea className="textarea" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="รายละเอียดสินค้า"/>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>ราคา (บาท)</label>
                <input className="input" type="number" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})}/>
              </div>
              <div className="form-field">
                <label>หมวดหมู่</label>
                <select className="select" value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}>
                  <option value="">— เลือก —</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>ประเภทส่ง</label>
                <select className="select" value={form.deliveryType} onChange={e=>setForm({...form,deliveryType:e.target.value as 'auto'|'manual'})}>
                  <option value="manual">Manual</option>
                  <option value="auto">Auto (จากคีย์)</option>
                </select>
              </div>
              {form.deliveryType==='manual' && (
                <div className="form-field">
                  <label>สต็อก</label>
                  <input className="input" type="number" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})}/>
                </div>
              )}
            </div>
            {form.deliveryType==='auto' && (
              <div className="form-field">
                <label>คีย์ (1 บรรทัด = 1 คีย์)</label>
                <textarea className="textarea" style={{minHeight:100,fontFamily:'var(--font-mono)',fontSize:12}}
                  value={keysText} onChange={e=>setKeysText(e.target.value)}
                  placeholder={"KEY-XXXX-XXXX-0001\nKEY-XXXX-XXXX-0002"}/>
                <div className="input-hint">{keysText.split('\n').filter(s=>s.trim()).length} คีย์</div>
              </div>
            )}
            <div className="form-field">
              <label>URL รูปภาพ</label>
              <input className="input" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/>
            </div>
            <div className="form-field">
              <label>สถานะ</label>
              <select className="select" value={form.active?'1':'0'} onChange={e=>setForm({...form,active:e.target.value==='1'})}>
                <option value="1">เปิดขาย</option>
                <option value="0">ปิดชั่วคราว</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="btn" onClick={()=>setModal(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={saveProduct}>บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {modal==='delete' && (
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="modal" style={{maxWidth:360}}>
            <div className="modal-hd"><h3>ยืนยันการลบ</h3></div>
            <p style={{fontSize:14,color:'var(--text-2)',marginBottom:20}}>ต้องการลบสินค้านี้? ไม่สามารถกู้คืนได้</p>
            <div className="form-actions" style={{borderTop:'none',paddingTop:0,marginTop:0}}>
              <button className="btn" onClick={()=>setModal(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={deleteProduct}>ลบ</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-root"><div className={`toast ${toast.type}`}>{toast.msg}</div></div>}
    </div>
  )
}
