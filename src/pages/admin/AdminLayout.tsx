import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/requests', label: 'Requests' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/before-after', label: 'Before & After' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/faqs', label: 'FAQs' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F1E8]">
      <aside className="md:w-60 flex-none bg-winedark text-ivory/85 p-3 md:p-5 flex md:flex-col gap-1 overflow-x-auto items-center md:items-stretch">
        <div className="font-display text-white text-lg px-2 pb-0 md:pb-5 flex-none flex items-center gap-2">
          <span className="w-7 h-7 rounded-full" style={{ background: 'conic-gradient(from 200deg, #6E1E3C, #B8923F, #1F4B4A, #6E1E3C)' }} />
          Admin
        </div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap flex-none ${
                isActive ? 'bg-white/10 text-white' : 'hover:bg-white/10'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button onClick={signOut} className="md:mt-auto ml-auto md:ml-0 px-3.5 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 flex-none">
          ↩ Logout
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-line sticky top-0 z-10">
          <div />
          <a href="/" className="border border-wine text-wine text-xs font-bold px-4 py-2 rounded-full">View Site</a>
        </div>
        <div className="p-5 md:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
