# Shop — Next.js E-Commerce

## Setup

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## Admin Panel

เปิด http://localhost:3000/admin/login

Default credentials:
- Username: `admin`
- Password: `admin123`

เปลี่ยนรหัสผ่านได้ที่ Admin → ตั้งค่า

## Environment Variables

แก้ไข `.env.local`:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-key-change-this
```

## Structure

```
app/
  page.tsx          — Homepage
  store/            — Product listing + detail
  admin/            — Admin panel (protected)
  api/              — REST API routes

data/               — JSON "database" (อัปเกรดเป็น DB ได้ภายหลัง)
  products.json
  categories.json
  orders.json
  reviews.json
  settings.json
```

## Features

- หน้าแรก: Hero, Stats, Marquee, Categories, Recent purchases, Reviews
- หน้าสินค้า: Grid + Category filter + Search
- หน้าสินค้าละเอียด: ข้อมูล + Buy form + Auto/Manual delivery
- Admin: Dashboard, Products CRUD, Categories CRUD, Orders management, Reviews management, Settings
- Auth: JWT cookie, bcrypt password hashing
