"use client"
import { useEffect, useState } from 'react'

interface Settings { shopName:string; shopDescription:string; shopLogo:string; discordUrl:string; announcement:string }

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({ shopName:'', shopDescription:'', shopLogo:'', discordUrl:'', announcement:'' })
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/settings').then(r=>r.json()).then(setSettings) }, [])
  const showToast = (msg:string,type:'ok'|'err'='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  async function saveSettings() {
    setLoading(true)
    const res = await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(settings)})
    setLoading(false)
    if(res.ok) showToast('บันทึกการตั้งค่าแล้ว')
    else showToast('เกิดข้อผิดพลาด','err')
  }

  async function changePassword() {
    if(newPass !== confirmPass) { showToast('รหัสผ่านไม่ตรงกัน','err'); return }
    if(newPass.length < 6) { showToast('รหัสผ่านต้องมีอย่างน้อย 6 ตัว','err'); return }
    setLoading(true)
    const res = await fetch('/api/auth/change-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({oldPassword:oldPass,newPassword:newPass})})
    setLoading(false)
    if(res.ok) { showToast('เปลี่ยนรหัสผ่านแล้ว'); setOldPass(''); setNewPass(''); setConfirmPass('') }
    else { const d = await res.json(); showToast(d.error||'เกิดข้อผิดพลาด','err') }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-hd"><h1>ตั้งค่าร้าน</h1></div>

      <div className="two-col" style={{maxWidth:800}}>
        {/* SHOP SETTINGS */}
        <div style={{gridColumn:'1/-1'}}>
          <h2 style={{fontFamily:'var(--font-mono)',fontSize:14,fontWeight:600,marginBottom:16,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>ข้อมูลร้านค้า</h2>
        </div>
        <div className="form-field">
          <label>ชื่อร้าน</label>
          <input className="input" value={settings.shopName} onChange={e=>setSettings({...settings,shopName:e.target.value})} placeholder="ชื่อร้าน"/>
        </div>
        <div className="form-field">
          <label>คำอธิบายร้าน</label>
          <input className="input" value={settings.shopDescription} onChange={e=>setSettings({...settings,shopDescription:e.target.value})} placeholder="คำอธิบายสั้นๆ"/>
        </div>
        <div className="form-field">
          <label>URL โลโก้ร้าน</label>
          <input className="input" value={settings.shopLogo} onChange={e=>setSettings({...settings,shopLogo:e.target.value})} placeholder="https://..."/>
        </div>
        <div className="form-field">
          <label>Discord URL</label>
          <input className="input" value={settings.discordUrl} onChange={e=>setSettings({...settings,discordUrl:e.target.value})} placeholder="https://discord.gg/..."/>
        </div>
        <div className="form-field full-col">
          <label>ประกาศ (แสดงด้านบนเว็บ)</label>
          <input className="input" value={settings.announcement} onChange={e=>setSettings({...settings,announcement:e.target.value})} placeholder="ข้อความประกาศ หรือเว้นว่างเพื่อซ่อน"/>
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <button className="btn btn-primary" onClick={saveSettings} disabled={loading}>บันทึกการตั้งค่า</button>
        </div>

        {/* PASSWORD */}
        <div style={{gridColumn:'1/-1',marginTop:32}}>
          <h2 style={{fontFamily:'var(--font-mono)',fontSize:14,fontWeight:600,marginBottom:16,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>เปลี่ยนรหัสผ่าน Admin</h2>
        </div>
        <div className="form-field">
          <label>รหัสผ่านปัจจุบัน</label>
          <input className="input" type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)}/>
        </div>
        <div className="form-field">
          <label>รหัสผ่านใหม่</label>
          <input className="input" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}/>
        </div>
        <div className="form-field">
          <label>ยืนยันรหัสผ่านใหม่</label>
          <input className="input" type="password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)}/>
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <button className="btn btn-primary" onClick={changePassword} disabled={loading}>เปลี่ยนรหัสผ่าน</button>
        </div>
      </div>

      {toast && <div className="toast-root"><div className={`toast ${toast.type}`}>{toast.msg}</div></div>}
    </div>
  )
}
