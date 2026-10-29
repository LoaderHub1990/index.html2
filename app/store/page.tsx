import Link from 'next/link'
import { db } from '@/lib/db'

export default function StorePage({ searchParams }: { searchParams: { cat?: string; q?: string } }) {
  const settings = db.settings.get()
  const allProducts = db.products.all().filter(p => p.active)
  const categories = db.categories.all()
  const { cat, q } = searchParams

  let products = allProducts
  if (cat) products = products.filter(p => p.categoryId === cat)
  if (q) products = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '—'

  return (
    <>
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden>
        <defs>
          <symbol id="home" viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></symbol>
          <symbol id="store" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
          <symbol id="discord" viewBox="0 0 127.14 96.36"><path stroke="none" fill="currentColor" d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.63 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/></symbol>
          <symbol id="arr" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
          <symbol id="back" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></symbol>
          <symbol id="search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></symbol>
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

      <main className="wrap" style={{paddingTop:40,paddingBottom:60}}>
        <div className="rv" style={{'--d':1} as any}>
          <h1 style={{fontFamily:'var(--font-mono)',fontSize:28,fontWeight:700,letterSpacing:'-.03em',marginBottom:8}}>สินค้าทั้งหมด</h1>
          <p style={{fontSize:14,color:'var(--text-2)',marginBottom:24}}>{allProducts.length} รายการ</p>
        </div>

        {/* SEARCH */}
        <form method="GET" action="/store" className="toolbar rv" style={{'--d':2} as any}>
          <div className="search-wrap" style={{maxWidth:320}}>
            <svg className="i"><use href="#search"/></svg>
            <input name="q" type="text" placeholder="ค้นหาสินค้า..." defaultValue={q || ''} className="input" style={{border:'none',padding:0,background:'none'}}/>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">ค้นหา</button>
          {(cat || q) && <Link href="/store" className="btn btn-sm">ล้างตัวกรอง</Link>}
        </form>

        {/* CATEGORY FILTERS */}
        <div className="cat-filters rv" style={{'--d':3} as any}>
          <Link href="/store" className={`cat-filter${!cat ? ' active' : ''}`}>ทั้งหมด</Link>
          {categories.map(c => (
            <Link key={c.id} href={`/store?cat=${c.id}`} className={`cat-filter${cat === c.id ? ' active' : ''}`}>{c.name}</Link>
          ))}
        </div>

        {/* GRID */}
        {products.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 20px',color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:13}}>ไม่พบสินค้า</div>
        ) : (
          <div className="products-grid rv" style={{'--d':4} as any}>
            {products.map(p => (
              <Link key={p.id} href={`/store/${p.id}`} className="product-card">
                <div className="thumb">
                  {p.image ? <img src={p.image} alt={p.name}/> : <svg className="i"><use href="#store"/></svg>}
                </div>
                {p.stock === 0 && <span className="stock-badge out">หมด</span>}
                <div className="body">
                  <div className="name">{p.name}</div>
                  <div className="cat-tag">{getCatName(p.categoryId)}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                    <div className="price">฿{p.price}</div>
                    <div style={{fontSize:11,color:'var(--text-3)',fontFamily:'var(--font-mono)'}}>ขายแล้ว {p.totalSold}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="footer wrap">
        <span className="footer-credit">© {new Date().getFullYear()} {settings.shopName}</span>
      </footer>
    </>
  )
}
