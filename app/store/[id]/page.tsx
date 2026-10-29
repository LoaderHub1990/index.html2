"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Product {
  id: string; name: string; description: string; price: number
  categoryId: string; image: string; deliveryType: string
  stock: number; totalSold: number; active: boolean
}
interface Category { id: string; name: string }

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState({ shopName: 'Shop', shopLogo: '', discordUrl: '/' })
  const [buyer, setBuyer] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ key?: string; orderId?: string; error?: string } | null>(null)

  useEffect(() => {
    fetch('/api/products/' + id).then(r => r.json()).then(d => setProduct(d))
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d))
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d))
  }, [id])

  const catName = categories.find(c => c.id === product?.categoryId)?.name || '—'

  async function handleBuy() {
    if (!buyer.trim()) return
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, buyerAlias: buyer.trim().slice(0, 3) + '***', note })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  if (!product) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100dvh',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-3)'}}>กำลังโหลด...</div>
  )

  return (
    <>
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden>
        <defs>
          <symbol id="home" viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></symbol>
          <symbol id="store" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
          <symbol id="discord" viewBox="0 0 127.14 96.36"><path stroke="none" fill="currentColor" d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.63 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/></symbol>
          <symbol id="back" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></symbol>
          <symbol id="copy" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></symbol>
        </defs>
      </svg>

      <header className="nav">
        <Link href="/" className="brand">
          {settings.shopLogo
            ? <img src={settings.shopLogo} alt={settings.shopName}/>
            : <span className="brand-icon"><svg className="i"><use href="#store"/></svg></span>
          }
          <b>{settings.shopName}</b>
        </Link>
        <nav>
          <Link href="/" className="nl"><svg className="i"><use href="#home"/></svg><span>หน้าแรก</span></Link>
          <Link href="/store" className="nl on"><svg className="i"><use href="#store"/></svg><span>สินค้า</span></Link>
          <a href={settings.discordUrl} target="_blank" rel="noopener" className="nl"><svg className="i"><use href="#discord"/></svg><span>Discord</span></a>
        </nav>
      </header>

      <main className="wrap">
        <div className="product-detail rv" style={{'--d':1} as any}>
          {/* THUMB */}
          <div className="pd-thumb">
            {product.image ? <img src={product.image} alt={product.name}/> : <svg className="i"><use href="#store"/></svg>}
          </div>

          {/* INFO */}
          <div>
            <div className="pi-cat">{catName}</div>
            <div className="pi-name">{product.name}</div>
            <p className="pi-desc">{product.description}</p>
            <div className="pi-price">฿{product.price} <span>บาท</span></div>
            <div className="pi-stock">คงเหลือ: {product.stock} | ขายแล้ว: {product.totalSold}</div>

            {result ? (
              result.error ? (
                <div className="login-err">{result.error}</div>
              ) : (
                <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20}}>
                  <p style={{fontFamily:'var(--font-mono)',fontSize:13,marginBottom:12,color:'#4ade80'}}>✓ สั่งซื้อสำเร็จ #{result.orderId}</p>
                  {result.key ? (
                    <>
                      <p style={{fontSize:12,color:'var(--text-2)',marginBottom:8}}>คีย์ของคุณ:</p>
                      <div style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:6,padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:14,letterSpacing:'0.05em',marginBottom:12}}>{result.key}</div>
                      <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(result.key||'')}>
                        <svg className="i"><use href="#copy"/></svg>คัดลอก
                      </button>
                    </>
                  ) : (
                    <p style={{fontSize:13,color:'var(--text-2)'}}>ทีมงานจะส่งสินค้าให้คุณโดยเร็ว กรุณาติดต่อ Discord</p>
                  )}
                </div>
              )
            ) : product.stock === 0 ? (
              <div style={{padding:'12px 16px',background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.2)',borderRadius:'var(--radius-sm)',fontFamily:'var(--font-mono)',fontSize:12,color:'#f87171'}}>สินค้าหมด</div>
            ) : (
              <div className="buy-form">
                <div className="form-field" style={{margin:0}}>
                  <label>ชื่อผู้ซื้อ / ยูสเซอร์</label>
                  <input className="input" type="text" placeholder="ใส่ชื่อหรือ ID ของคุณ" value={buyer} onChange={e => setBuyer(e.target.value)}/>
                </div>
                <div className="form-field" style={{margin:0}}>
                  <label>หมายเหตุ (ไม่บังคับ)</label>
                  <input className="input" type="text" placeholder="ช่องทางการชำระเงิน ฯลฯ" value={note} onChange={e => setNote(e.target.value)}/>
                </div>
                <button
                  className="cta-btn"
                  style={{alignSelf:'flex-start'}}
                  onClick={handleBuy}
                  disabled={loading || !buyer.trim()}
                >
                  {loading ? 'กำลังดำเนินการ...' : `สั่งซื้อ ฿${product.price}`}
                </button>
                <p style={{fontSize:11,color:'var(--text-3)',fontFamily:'var(--font-mono)'}}>* ระบบสร้างออเดอร์รอการชำระเงิน สินค้า auto delivery จะส่งคีย์ทันทีหลังยืนยัน</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer wrap">
        <span className="footer-credit">© {new Date().getFullYear()} {settings.shopName}</span>
      </footer>
    </>
  )
}
