import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, MessageCircle } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { buildWhatsAppLink } from '../lib/whatsapp'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/before-after', label: 'Before & After' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold pb-1 border-b-2 ${
      isActive ? 'text-wine border-gold' : 'text-inksoft border-transparent hover:text-wine'
    }`

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-base sm:text-xl font-semibold text-winedark truncate max-w-[46vw] sm:max-w-none"
        >
          <span
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-none"
            style={{ background: 'conic-gradient(from 200deg, #6E1E3C, #B8923F, #1F4B4A, #6E1E3C)' }}
          />
          <span className="truncate">{settings.business_name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello, I would like to know more about your saree services.')}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex w-9 h-9 rounded-full bg-ivorydeep border border-line items-center justify-center flex-none"
            title="WhatsApp"
          >
            <MessageCircle size={17} className="text-teal" />
          </a>
          <Link
            to="/request"
            className="bg-wine hover:bg-winedark text-ivory text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-colors"
          >
            <span className="hidden xs:inline">Request a Service</span>
            <span className="xs:hidden">Request</span>
          </Link>
          <button
            className="md:hidden w-9 h-9 rounded-full bg-ivorydeep border border-line flex items-center justify-center flex-none"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-ivory px-4 sm:px-6 pb-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-3 font-bold text-inksoft border-b border-line"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/request" onClick={() => setOpen(false)} className="block py-3 font-bold text-inksoft border-b border-line">
            Request a Service
          </Link>
          <Link to="/admin" onClick={() => setOpen(false)} className="block py-3 font-bold text-inksoft">
            Admin Login
          </Link>
        </div>
      )}
    </header>
  )
}
