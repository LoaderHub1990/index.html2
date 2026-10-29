import AdminSidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'

export const metadata = { title: 'Admin Panel' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden>
        <defs>
          <symbol id="shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>
        </defs>
      </svg>
      <AdminSidebar />
      <div className="admin-content">
        <Topbar />
        {children}
      </div>
    </div>
  )
}
