import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ServiceCard from '../components/ServiceCard'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSettings } from '../contexts/SettingsContext'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { getActiveServices, getPublishedShowcases, getPublishedTestimonials, getPublishedFaqs } from '../lib/api'
import type { Service, Showcase, Testimonial, FAQ } from '../lib/types'

export default function Home() {
  const { settings } = useSettings()
  const [services, setServices] = useState<Service[] | null>(null)
  const [showcases, setShowcases] = useState<Showcase[] | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null)
  const [faqs, setFaqs] = useState<FAQ[] | null>(null)
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  useEffect(() => {
    getActiveServices().then(setServices).catch(() => setServices([]))
    getPublishedShowcases({ limit: 3 }).then(setShowcases).catch(() => setShowcases([]))
    getPublishedTestimonials().then(setTestimonials).catch(() => setTestimonials([]))
    getPublishedFaqs().then(setFaqs).catch(() => setFaqs([]))
  }, [])

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="pt-12 sm:pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-extrabold tracking-widest uppercase text-wine">
              Saree Finishing &amp; Customisation Studio
            </span>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight text-winedark mt-2">
              Turn Your Saree Into Something Special
            </h1>
            <p className="text-inksoft text-lg mt-4 max-w-md">
              Premium saree finishing, tassel work, repairs, alterations, blouse making and custom saree services — done with care, by hand.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/request" className="bg-wine hover:bg-winedark text-ivory font-bold px-6 py-3.5 rounded-full transition-colors">
                Request a Service
              </Link>
              <Link to="/before-after" className="border border-wine text-wine font-bold px-6 py-3.5 rounded-full hover:bg-wine hover:text-ivory transition-colors">
                View Our Work
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-5 text-sm font-bold text-inksoft">
              <a href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello, I would like to know more about your saree services.')} target="_blank" rel="noreferrer">
                💬 Chat on WhatsApp
              </a>
              <a href="tel:">📞 Call {settings.phone}</a>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-xl2 overflow-hidden bg-gradient-to-br from-wine to-gold flex items-center justify-center">
            {settings.hero_image_url ? (
              <img src={settings.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <span className="text-ivory/90 border border-ivory/60 rounded-full px-4 py-2 text-xs uppercase tracking-wide font-display">
                Hero Image — set from Admin
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-9">
            <span className="text-xs font-extrabold tracking-widest uppercase text-wine">What We Do</span>
            <h2 className="font-display text-3xl text-winedark mt-2">Our Services</h2>
            <p className="text-inksoft mt-3">From delicate tassel work to full saree restoration — every service is carried out with attention to detail.</p>
          </div>
          {services === null ? (
            <LoadingSpinner label="Loading services…" />
          ) : services.length === 0 ? (
            <p className="text-inksoft">Services will appear here once added from the admin dashboard.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 bg-ivorydeep">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-9">
            <span className="text-xs font-extrabold tracking-widest uppercase text-wine">Why Us</span>
            <h2 className="font-display text-3xl text-winedark mt-2">Why Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              ['Skilled Finishing', 'Careful, hand-finished work', 'Every piece is finished by hand with attention to detail, not rushed through a production line.'],
              ['Careful Repair', 'Restoration that blends in', 'Torn or damaged sarees are repaired to blend naturally with the surrounding fabric.'],
              ['Custom Designs', 'Work suited to your saree', "Tassels, alterations and blouses matched to your saree's fabric, colour and occasion."],
              ['Quality Focus', 'Quality-focused approach', 'We take the time needed to get the finish right rather than cutting corners.'],
              ['Personal Attention', "You're kept informed", 'Clear communication on pricing and timelines before any work begins.'],
              ['Experience', 'Experienced craftsmanship', 'Years of hands-on experience working with a wide range of saree fabrics.'],
            ].map(([tag, title, body]) => (
              <div key={title} className="p-6 rounded-xl2 bg-white border border-line">
                <div className="font-display text-gold text-sm font-semibold">{tag}</div>
                <h4 className="mt-2 font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-inksoft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After preview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-9">
            <span className="text-xs font-extrabold tracking-widest uppercase text-wine">See The Difference</span>
            <h2 className="font-display text-3xl text-winedark mt-2">Before &amp; After</h2>
            <p className="text-inksoft mt-3">Drag the divider to see the transformation.</p>
          </div>
          {showcases === null ? (
            <LoadingSpinner label="Loading work…" />
          ) : showcases.length === 0 ? (
            <p className="text-inksoft">No work has been added yet. Check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcases.map((sc) => {
                const before = sc.showcase_images?.find((i) => i.image_type === 'before')?.image_url
                const after = sc.showcase_images?.find((i) => i.image_type === 'after')?.image_url
                return (
                  <div key={sc.id} className="bg-white border border-line rounded-xl2 p-3.5 shadow-card">
                    {before && after ? (
                      <BeforeAfterSlider beforeUrl={before} afterUrl={after} alt={sc.title} />
                    ) : (
                      <div className="aspect-[4/3] rounded-xl bg-ivorydeep flex items-center justify-center text-inksoft text-sm">Images pending</div>
                    )}
                    <h4 className="font-display text-lg mt-3">{sc.title}</h4>
                    <span className="text-xs font-extrabold uppercase tracking-wide text-teal">{sc.category}</span>
                    <p className="text-sm text-inksoft mt-1.5">{sc.description}</p>
                  </div>
                )
              })}
            </div>
          )}
          <div className="text-center mt-9">
            <Link to="/before-after" className="border border-wine text-wine font-bold px-6 py-3 rounded-full hover:bg-wine hover:text-ivory transition-colors">
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-ivorydeep">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-9 mx-auto text-center">
            <span className="text-xs font-extrabold tracking-widest uppercase text-wine">Simple Process</span>
            <h2 className="font-display text-3xl text-winedark mt-2">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ['01', 'Choose Your Service', 'Select the type of work you need from our services.'],
              ['02', 'Send Photos', 'Upload clear photos of your saree and the area needing work.'],
              ['03', 'Get a Quote', 'We inspect the requirement and share pricing before starting.'],
              ['04', 'Get Your Saree Back', 'Once the work is completed, your saree is ready for pickup or delivery.'],
            ].map(([n, t, d]) => (
              <div key={n} className="p-6 rounded-xl2 bg-white border border-line">
                <div className="font-display text-3xl text-goldlight" style={{ WebkitTextStroke: '1px #B8923F' }}>{n}</div>
                <h4 className="mt-2 font-semibold">{t}</h4>
                <p className="mt-1.5 text-sm text-inksoft">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-9 mx-auto text-center">
              <span className="text-xs font-extrabold tracking-widest uppercase text-wine">Kind Words</span>
              <h2 className="font-display text-3xl text-winedark mt-2">What Customers Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="p-6 rounded-xl2 bg-wine text-ivory">
                  <div className="text-goldlight text-sm tracking-widest">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p className="font-display italic mt-3 text-[17px] leading-relaxed">"{t.review}"</p>
                  <div className="mt-4 text-sm font-bold">— {t.customer_name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 bg-ivorydeep">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="mb-9 text-center">
              <span className="text-xs font-extrabold tracking-widest uppercase text-wine">Questions</span>
              <h2 className="font-display text-3xl text-winedark mt-2">Frequently Asked Questions</h2>
            </div>
            {faqs.map((f) => {
              const open = openFaq === f.id
              return (
                <div key={f.id} className="border-b border-line py-4.5">
                  <button
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-winedark"
                    onClick={() => setOpenFaq(open ? null : f.id)}
                  >
                    <span>{f.question}</span>
                    <span className={`text-gold text-lg transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {open && <p className="text-sm text-inksoft mt-2.5">{f.answer}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-wine to-winedark text-ivory text-center py-14 px-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-goldlight">Ready When You Are</span>
            <h2 className="font-display text-3xl text-ivory mt-2">Have A Saree That Needs Attention?</h2>
            <p className="text-ivory/80 mt-2">Send us photos and we'll take care of the rest.</p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link to="/request" className="bg-gold text-winedark font-bold px-6 py-3.5 rounded-full">
                Request a Service
              </Link>
              <a
                href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello, I would like to know more about your saree services.')}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 border border-white/40 text-ivory font-bold px-6 py-3.5 rounded-full"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
