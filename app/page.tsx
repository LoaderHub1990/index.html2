import Link from 'next/link'
import { db } from '@/lib/db'

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

export default function Home() {
  const settings = db.settings.get()
  const products = db.products.all().filter(p => p.active)
  const categories = db.categories.all()
  const orders = db.orders.all().filter(o => o.status === 'completed').slice(-10).reverse()
  const reviews = db.reviews.all().filter(r => r.visible).slice(0, 6)

  const totalSold = products.reduce((a, p) => a + p.totalSold, 0)
  const totalStock = products.reduce((a, p) => a + p.stock, 0)

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '—'

  const marqItems = ['บริการทันใจ', 'ส่งอัตโนมัติ', 'เมนูภาษาไทย', 'อัปเดตสม่ำเสมอ', 'ฟังก์ชันครบ']

  return (
    <>
      {settings.announcement && (
        <div className="announce">⚡ {settings.announcement}</div>
      )}

      {/* NAV */}
      <header className="nav">
        <Link href="/" className="brand">
          {settings.shopLogo
            ? <img src={settings.shopLogo} alt={settings.shopName} />
            : <span className="brand-icon"><svg className="i"><use href="#store"/></svg></span>
          }
          <b>{settings.shopName}</b>
        </Link>
        <nav>
          <Link href="/" className="nl on"><svg className="i"><use href="#home"/></svg><span>หน้าแรก</span></Link>
          <Link href="/store" className="nl"><svg className="i"><use href="#store"/></svg><span>สินค้า</span></Link>
          <a href={settings.discordUrl} target="_blank" rel="noopener" className="nl"><svg className="i"><use href="#discord"/></svg><span>Discord</span></a>
        </nav>
      </header>

      {/* SVG DEFS */}
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden>
        <defs>
          <symbol id="home" viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></symbol>
          <symbol id="store" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
          <symbol id="discord" viewBox="0 0 127.14 96.36"><path stroke="none" fill="currentColor" d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.63 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/></symbol>
          <symbol id="zap" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></symbol>
          <symbol id="arr" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
          <symbol id="key" viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M16 7l3 3M14 9l2 2"/></symbol>
          <symbol id="terminal" viewBox="0 0 24 24"><path d="m4 17 6-6-6-6M12 19h8"/></symbol>
          <symbol id="layers" viewBox="0 0 24 24"><path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/></symbol>
          <symbol id="shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>
        </defs>
      </svg>

      <main className="wrap">
        {/* HERO */}
        <section className="hero">
          <p className="eyebrow rv" style={{'--d':1} as any}>ยินดีต้อนรับ</p>
          <h1 className="display rv" style={{'--d':2} as any}>{settings.shopName}</h1>
          <p className="lead rv" style={{'--d':3} as any}>{settings.shopDescription}</p>
          <div className="chips rv" style={{'--d':4} as any}>
            <span className="chip"><svg className="i"><use href="#shield"/></svg>ปลอดภัย</span>
            <span className="chip"><svg className="i"><use href="#zap"/></svg>ส่งทันที</span>
            <span className="chip"><svg className="i"><use href="#layers"/></svg>ฟังก์ชันครบ</span>
          </div>
          <div className="cta-row rv" style={{'--d':5} as any}>
            <Link href="/store" className="cta-btn"><svg className="i"><use href="#store"/></svg>ดูสินค้า</Link>
            <a href={settings.discordUrl} target="_blank" rel="noopener" className="cta-btn ghost"><svg className="i"><use href="#discord"/></svg>Discord</a>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-row rv" style={{'--d':6} as any}>
          <div className="stat"><span className="stat-val">{products.length}</span><span className="stat-label">สินค้า</span></div>
          <div className="stat"><span className="stat-val">{categories.length}</span><span className="stat-label">หมวดหมู่</span></div>
          <div className="stat"><span className="stat-val">{totalSold.toLocaleString()}</span><span className="stat-label">ขายแล้ว</span></div>
          <div className="stat"><span className="stat-val">{totalStock}</span><span className="stat-label">คงเหลือ</span></div>
        </div>

        {/* MARQUEE */}
        <div className="marq rv" style={{'--d':7} as any}>
          <div className="track">
            {[...marqItems, ...marqItems].map((t, i) => (
              <>
                <span key={`t${i}`}>{t}</span>
                <svg key={`z${i}`} className="i"><use href="#zap"/></svg>
              </>
            ))}
          </div>
        </div>

        {/* CATEGORIES BENTO */}
        {categories.length > 0 && (
          <section className="sec rv" style={{'--d':8} as any}>
            <div className="section-hd"><h2>หมวดหมู่</h2><Link href="/store">ดูทั้งหมด <svg className="i"><use href="#arr"/></svg></Link></div>
            <div className="bento">
              {categories.slice(0, 3).map((cat, i) => {
                const count = products.filter(p => p.categoryId === cat.id).length
                return (
                  <Link key={cat.id} href={`/store?cat=${cat.id}`} className={`panel feat${i === 0 ? ' wide' : ''}`} style={{'--d': i+9} as any}>
                    <div className="ico"><svg className="i"><use href="#layers"/></svg></div>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <span className="more">{count} สินค้า <svg className="i"><use href="#arr"/></svg></span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* FEATURED PRODUCTS */}
        <section className="sec rv" style={{'--d':9} as any}>
          <div className="section-hd"><h2>สินค้าแนะนำ</h2><Link href="/store">ดูทั้งหมด <svg className="i"><use href="#arr"/></svg></Link></div>
          <div className="products-grid">
            {products.slice(0, 4).map(p => (
              <Link key={p.id} href={`/store/${p.id}`} className="product-card">
                <div className="thumb">
                  {p.image ? <img src={p.image} alt={p.name}/> : <svg className="i"><use href="#store"/></svg>}
                </div>
                {p.stock === 0 && <span className="stock-badge out">หมด</span>}
                <div className="body">
                  <div className="name">{p.name}</div>
                  <div className="cat-tag">{getCatName(p.categoryId)}</div>
                  <div className="price">฿{p.price} <span style={{fontSize:11,color:'var(--text-2)'}}>บาท</span></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* RECENT PURCHASES */}
        {orders.length > 0 && (
          <section className="sec rv" style={{'--d':10} as any}>
            <div className="section-hd"><h2>ซื้อล่าสุด</h2></div>
            <div className="recent-list">
              {orders.map(o => (
                <div key={o.id} className="recent-item">
                  <span className="ri-dot"/>
                  <span className="ri-name">{o.productName}</span>
                  <span className="ri-buyer">{o.buyerAlias}</span>
                  <span className="ri-time">{timeAgo(o.createdAt)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        {reviews.length > 0 && (
          <section className="sec rv" style={{'--d':11} as any}>
            <div className="section-hd"><h2>รีวิวจากลูกค้า</h2></div>
            <div className="reviews-grid">
              {reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-hd">
                    <div className="review-avatar">{r.author[0].toUpperCase()}</div>
                    <div>
                      <div className="review-author">{r.author}</div>
                      <div className="review-product">{r.productName}</div>
                    </div>
                    <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  </div>
                  <p className="review-text">{r.comment}</p>
                  <div className="review-date">{new Date(r.createdAt).toLocaleDateString('th-TH')}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer wrap">
        <span className="footer-credit">© {new Date().getFullYear()} {settings.shopName} — All rights reserved.</span>
        <div className="footer-links">
          <Link href="/store">สินค้า</Link>
          <a href={settings.discordUrl} target="_blank" rel="noopener">Discord</a>
          <Link href="/admin">Admin</Link>
        </div>
      </footer>
    </>
  )
}
