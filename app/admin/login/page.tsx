"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'เข้าสู่ระบบไม่ได้')
    }
    setLoading(false)
  }

  return (
    <>
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden>
        <defs>
          <symbol id="lock" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></symbol>
        </defs>
      </svg>
      <div className="login-root">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-title">⌨ Admin</div>
          <div className="login-sub">เข้าสู่ระบบจัดการร้าน</div>
          {error && <div className="login-err">{error}</div>}
          <div className="form-field">
            <label>Username</label>
            <input className="input" type="text" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required/>
          </div>
          <div className="form-field">
            <label>Password</label>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required/>
          </div>
          <button className="btn btn-primary" type="submit" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
          <p style={{marginTop:16,fontSize:11,color:'var(--text-3)',fontFamily:'var(--font-mono)',textAlign:'center'}}>default: admin / admin123</p>
        </form>
      </div>
    </>
  )
}
