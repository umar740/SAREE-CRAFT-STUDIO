import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSettings } from '../contexts/SettingsContext'
import { useToast } from '../contexts/ToastContext'
import { buildWhatsAppLink } from '../lib/whatsapp'

export default function Contact() {
  const { settings } = useSettings()
  const { showToast } = useToast()

  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / Contact
          </div>
          <h1 className="font-display text-4xl text-winedark">Contact Us</h1>
        </div>
      </div>
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10">
          <div>
            <div className="bg-white border border-line rounded-xl2 p-7 shadow-card mb-6">
              <h3 className="font-display text-lg text-winedark mb-3">Reach Us Directly</h3>
              <p className="my-1.5"><strong>Phone:</strong> {settings.phone}</p>
              <p className="my-1.5"><strong>WhatsApp:</strong> {settings.whatsapp}</p>
              <p className="my-1.5"><strong>Email:</strong> {settings.email}</p>
              <p className="my-1.5"><strong>Address:</strong> {settings.address}</p>
              <p className="my-1.5"><strong>Business Hours:</strong> {settings.business_hours}</p>
              <div className="flex flex-wrap gap-3 mt-4.5">
                <a href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello!')} target="_blank" rel="noreferrer" className="bg-teal text-tealight font-bold px-5 py-3 rounded-full">
                  Chat on WhatsApp
                </a>
                <a href="tel:" className="border border-wine text-wine font-bold px-5 py-3 rounded-full">Call Now</a>
              </div>
            </div>
            <div className="aspect-video rounded-xl2 bg-gradient-to-br from-teal to-wine flex items-center justify-center">
              <span className="text-ivory/90 border border-ivory/60 rounded-full px-4 py-2 text-xs uppercase tracking-wide text-center">
                Google Maps — {settings.address}
              </span>
            </div>
          </div>
          <form
            className="bg-white border border-line rounded-xl2 p-7 shadow-card"
            onSubmit={(e) => {
              e.preventDefault()
              showToast('Message sent successfully.')
              ;(e.target as HTMLFormElement).reset()
            }}
          >
            <h3 className="font-display text-lg text-winedark mb-3">Send a Message</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1.5">Name *</label>
              <input className="input" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1.5">Phone or Email *</label>
              <input className="input" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1.5">Message *</label>
              <textarea className="input min-h-[100px]" required placeholder="How can we help?" />
            </div>
            <button type="submit" className="bg-wine hover:bg-winedark text-ivory font-bold px-6 py-3.5 rounded-full transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}
