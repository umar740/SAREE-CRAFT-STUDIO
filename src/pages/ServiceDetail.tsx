import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSettings } from '../contexts/SettingsContext'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { formatStartingPrice } from '../lib/utils'
import { getServiceBySlug, getServiceDesigns, getShowcasesByService, getPublishedFaqs } from '../lib/api'
import type { Service, ServiceDesign, Showcase, FAQ } from '../lib/types'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { settings } = useSettings()
  const [service, setService] = useState<Service | null | undefined>(undefined)
  const [designs, setDesigns] = useState<ServiceDesign[]>([])
  const [related, setRelated] = useState<Showcase[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [lightboxDesign, setLightboxDesign] = useState<ServiceDesign | null>(null)

  useEffect(() => {
    if (!slug) return
    getServiceBySlug(slug).then((s) => {
      setService(s)
      if (s) {
        getServiceDesigns(s.id).then(setDesigns)
        getShowcasesByService(s.id).then(setRelated)
      }
    })
    getPublishedFaqs().then(setFaqs)
  }, [slug])

  if (service === undefined) {
    return (
      <div>
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    )
  }

  if (service === null) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl text-winedark">Service not found</h1>
          <p className="text-inksoft mt-2">This service may have been unpublished or renamed.</p>
          <Link to="/services" className="inline-block mt-5 text-wine font-bold">← Back to Services</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-9">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-xs font-bold text-inksoft">
          <Link to="/" className="text-wine">Home</Link> / <Link to="/services" className="text-wine">Services</Link> / {service.name}
        </div>
      </div>

      <section className="pt-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/3] rounded-xl2 overflow-hidden bg-gradient-to-br from-wine to-gold">
            {service.image_url && <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <h1 className="font-display text-3xl text-winedark">{service.name}</h1>
            <p className="text-inksoft text-lg mt-3.5">{service.description}</p>
            <p className="mt-3.5 font-bold text-wine">
              {formatStartingPrice(service.starting_price)}
              {service.estimated_duration && <span className="text-inksoft font-semibold"> &nbsp;·&nbsp; Approx. {service.estimated_duration}</span>}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to={`/request?service=${service.slug}`} className="bg-wine hover:bg-winedark text-ivory font-bold px-6 py-3.5 rounded-full transition-colors">
                Request This Service
              </Link>
              <a
                href={buildWhatsAppLink(settings.whatsapp_digits, `Hello, I would like to know more about your ${service.name} service.`)}
                target="_blank"
                rel="noreferrer"
                className="border border-wine text-wine font-bold px-6 py-3.5 rounded-full hover:bg-wine hover:text-ivory transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {service.what_can_do?.length > 0 && (
        <section className="py-14 bg-ivorydeep mt-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl text-winedark mb-4">What We Can Do</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.what_can_do.map((w) => (
                <div key={w} className="p-4 rounded-xl2 bg-white border border-line text-sm font-semibold">✓ {w}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {designs.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <span className="text-xs font-extrabold tracking-widest uppercase text-wine">Choose A Style</span>
            <h2 className="font-display text-2xl text-winedark mt-2">Explore {designs.length} {service.name} Designs</h2>
            <p className="text-inksoft mt-2 mb-7">Tap a design to see it larger. When you're ready, request that specific style and we'll confirm pricing.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {designs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setLightboxDesign(d)}
                  className="text-left bg-white border border-line rounded-xl2 overflow-hidden shadow-card hover:-translate-y-1 transition-transform"
                >
                  <div className="aspect-square bg-ivorydeep">
                    {d.image_url && <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-3.5">
                    <h4 className="text-sm font-semibold leading-snug">{d.name}</h4>
                    <p className="text-xs text-inksoft mt-1 line-clamp-2">{d.description}</p>
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-gold mt-2">Tap to view →</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-14 bg-ivorydeep">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl text-winedark mb-6">Example Work</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((sc) => {
                const before = sc.showcase_images?.find((i) => i.image_type === 'before')?.image_url
                const after = sc.showcase_images?.find((i) => i.image_type === 'after')?.image_url
                return (
                  <div key={sc.id} className="bg-white border border-line rounded-xl2 p-3.5 shadow-card">
                    {before && after && <BeforeAfterSlider beforeUrl={before} afterUrl={after} alt={sc.title} />}
                    <h4 className="font-display text-lg mt-3">{sc.title}</h4>
                    <p className="text-sm text-inksoft mt-1.5">{sc.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="py-14">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl text-winedark mb-1">Frequently Asked Questions</h2>
            {faqs.map((f) => (
              <details key={f.id} className="border-b border-line py-3.5 group">
                <summary className="font-bold text-winedark cursor-pointer list-none flex justify-between">
                  {f.question}
                  <span className="text-gold group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-inksoft mt-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-wine to-winedark text-ivory text-center py-12 px-8">
            <h2 className="font-display text-2xl text-ivory">Ready to request {service.name}?</h2>
            <p className="text-ivory/80 mt-2">Send us a few photos and we'll get back to you with pricing.</p>
            <Link to={`/request?service=${service.slug}`} className="inline-block mt-5 bg-gold text-winedark font-bold px-6 py-3.5 rounded-full">
              Request This Service
            </Link>
          </div>
        </div>
      </section>

      {lightboxDesign && (
        <div
          className="fixed inset-0 z-[90] bg-black/85 flex items-center justify-center p-5"
          onClick={(e) => e.target === e.currentTarget && setLightboxDesign(null)}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden relative">
            <button
              onClick={() => setLightboxDesign(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 text-white z-10"
            >
              ✕
            </button>
            <div className="aspect-[4/3] bg-ivorydeep">
              {lightboxDesign.image_url && <img src={lightboxDesign.image_url} alt={lightboxDesign.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-6">
              <span className="text-xs font-extrabold uppercase tracking-wide text-wine">{service.name}</span>
              <h3 className="font-display text-xl text-winedark mt-1">{lightboxDesign.name}</h3>
              <p className="text-sm text-inksoft mt-2">{lightboxDesign.description}</p>
              <div className="flex flex-wrap gap-2.5 mt-5">
                <Link
                  to={`/request?service=${service.slug}&design=${encodeURIComponent(lightboxDesign.name)}&design_id=${lightboxDesign.id}`}
                  className="bg-wine text-ivory font-bold px-5 py-3 rounded-full"
                  onClick={() => setLightboxDesign(null)}
                >
                  Request This Design
                </Link>
                <a
                  href={buildWhatsAppLink(settings.whatsapp_digits, `Hello, I would like to ask about the ${lightboxDesign.name} design for ${service.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-wine text-wine font-bold px-5 py-3 rounded-full"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
