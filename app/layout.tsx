import type { Metadata } from 'next'
import './globals.css'
import { db } from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  const s = db.settings.get()
  return {
    title: s.shopName,
    description: s.shopDescription,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <div className="bg">
          <div className="orb a" />
          <div className="orb b" />
        </div>
        {children}
      </body>
    </html>
  )
}
