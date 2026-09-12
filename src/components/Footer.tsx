import { Link } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'
import { buildWhatsAppLink } from '../lib/whatsapp'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-winedark text-ivory/85 mt-10 pt-14 pb-7">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-9">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-xl text-ivory">{settings.business_name}</div>
          <p className="text-sm text-ivory/70 mt-3 max-w-[280px]">
            Premium saree finishing, tassel work, repairs, alterations, blouse making and custom saree services.
          </p>
          <div className="flex gap-2 mt-4">
            <a href={settings.instagram_url || '#'} className="w-8 h-8 rounded-lg bg-ivory/10 flex items-center justify-center text-xs">IG</a>
            <a href={settings.facebook_url || '#'} className="w-8 h-8 rounded-lg bg-ivory/10 flex items-center justify-center text-xs">FB</a>
            <a href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello!')} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-ivory/10 flex items-center justify-center text-xs">WA</a>
          </div>
        </div>
        <div>
          <h5 className="text-goldlight text-xs uppercase tracking-wider mb-3">Quick Links</h5>
          <Link to="/services" className="block text-sm py-1 hover:text-goldlight">Services</Link>
          <Link to="/before-after" className="block text-sm py-1 hover:text-goldlight">Before &amp; After</Link>
          <Link to="/request" className="block text-sm py-1 hover:text-goldlight">Request a Service</Link>
          <Link to="/about" className="block text-sm py-1 hover:text-goldlight">About Us</Link>
        </div>
        <div>
          <h5 className="text-goldlight text-xs uppercase tracking-wider mb-3">Legal</h5>
          <Link to="/privacy" className="block text-sm py-1 hover:text-goldlight">Privacy Policy</Link>
          <Link to="/terms" className="block text-sm py-1 hover:text-goldlight">Terms &amp; Conditions</Link>
          <Link to="/admin" className="block text-sm py-1 hover:text-goldlight">Admin Login</Link>
        </div>
        <div>
          <h5 className="text-goldlight text-xs uppercase tracking-wider mb-3">Contact</h5>
          <a href="tel:" className="block text-sm py-1 hover:text-goldlight">{settings.phone}</a>
          <a href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello!')} target="_blank" rel="noreferrer" className="block text-sm py-1 hover:text-goldlight">{settings.whatsapp} (WhatsApp)</a>
          <p className="text-sm py-1 text-ivory/70">{settings.address}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 pt-5 border-t border-ivory/15 flex flex-wrap justify-between gap-2 text-xs text-ivory/50">
        <span>© {new Date().getFullYear()} {settings.business_name}. All rights reserved.</span>
      </div>
    </footer>
  )
}
