import { useEffect, useState, FormEvent, ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ImageUploader, { PendingImage } from '../components/ImageUploader'
import { useSettings } from '../contexts/SettingsContext'
import { useToast } from '../contexts/ToastContext'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { supabase } from '../lib/supabase'
import { uploadToBucket } from '../lib/storage'
import { getActiveServices } from '../lib/api'
import type { Service } from '../lib/types'

export default function RequestService() {
  const { settings } = useSettings()
  const { showToast } = useToast()
  const [params] = useSearchParams()
  const preselectSlug = params.get('service') || ''
  const designName = params.get('design')
  const designId = params.get('design_id')

  const [services, setServices] = useState<Service[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [images, setImages] = useState<PendingImage[]>([])
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [agreedToPolicies, setAgreedToPolicies] = useState(false)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    serviceSlug: preselectSlug,
    description: designName ? `I'm interested in the "${designName}" design. ` : '',
    preferredDate: '',
    budget: '',
  })

  useEffect(() => {
    getActiveServices().then(setServices).catch(() => setServices([]))
  }, [])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.whatsapp || !form.serviceSlug || !form.description) {
      showToast('Please fill in all required fields.', 'error')
      return
    }
    // Hard gate: this check must happen here, in the handler itself, not only
    // via the disabled button — so no Supabase call or upload can ever fire
    // without agreement, even if the button state is somehow bypassed.
    if (!agreedToPolicies) {
      showToast('Please agree to our Terms & Conditions and Privacy Policy before submitting your request.', 'error')
      return
    }
    setSubmitting(true)
    try {
      const service = services.find((s) => s.slug === form.serviceSlug)

      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .insert({ name: form.name, phone: form.phone, whatsapp: form.whatsapp, email: form.email || null })
        .select()
        .single()
      if (custErr) throw custErr

      const { data: request, error: reqErr } = await supabase
        .from('service_requests')
        .insert({
          customer_id: customer.id,
          service_id: service?.id || null,
          design_id: designId || null,
          description: form.description,
          preferred_date: form.preferredDate || null,
          budget: form.budget ? Number(form.budget) : null,
          marketing_consent: marketingConsent,
        })
        .select()
        .single()
      if (reqErr) throw reqErr

      if (images.length > 0) {
        const uploads = await Promise.all(
          images.map(async (img) => {
            const path = await uploadToBucket('customer-uploads', img.file, request.id)
            return { request_id: request.id, image_url: path }
          })
        )
        const { error: imgErr } = await supabase.from('request_images').insert(uploads)
        if (imgErr) throw imgErr
      }

      setSubmittedRef(request.request_number)
      showToast('Request submitted successfully.')
    } catch (err: any) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / Request a Service
          </div>
          <h1 className="font-display text-4xl text-winedark">Request a Service</h1>
          <p className="text-inksoft mt-2.5 max-w-lg">Tell us about your saree and upload a few photos — we'll review and get back to you with pricing.</p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {!submittedRef && (
            <div className="bg-wine text-ivory rounded-xl2 p-5 mb-6 border-2 border-gold">
              <p className="font-display text-lg leading-snug">⚠️ IMPORTANT: PLEASE WASH YOUR SAREE BEFORE GIVING IT TO US.</p>
              <p className="font-bold mt-1.5">WE DO NOT WASH SAREES AS PART OF OUR SERVICE.</p>
              <p className="mt-1.5 text-ivory/90 text-sm">Please provide your saree in a clean and washed condition.</p>
            </div>
          )}
          {submittedRef ? (
            <div className="max-w-xl mx-auto text-center bg-white border border-line rounded-xl2 p-11 shadow-card">
              <div className="w-16 h-16 rounded-full bg-tealight text-teal flex items-center justify-center mx-auto text-3xl mb-4">✓</div>
              <h2 className="font-display text-2xl text-winedark">Your request has been submitted successfully.</h2>
              <div className="inline-block font-display text-2xl text-wine bg-ivorydeep border border-dashed border-gold rounded-xl2 px-6 py-2.5 my-4">
                REQUEST #{submittedRef}
              </div>
              <p className="text-inksoft">We will review your request and contact you with the price and next steps.</p>
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                <a
                  href={buildWhatsAppLink(settings.whatsapp_digits, `Hello, I submitted service request ${submittedRef} and would like to discuss it.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-teal text-tealight font-bold px-5 py-3 rounded-full"
                >
                  Chat on WhatsApp
                </a>
                <a href="tel:" className="border border-wine text-wine font-bold px-5 py-3 rounded-full">Call Us</a>
                <Link to="/" className="bg-wine text-ivory font-bold px-5 py-3 rounded-full">Back to Home</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-line rounded-xl2 p-6 sm:p-8 shadow-card">
              {designName && (
                <div className="bg-ivorydeep border border-dashed border-gold rounded-lg p-3.5 mb-5">
                  <label className="text-xs font-bold block mb-0.5">Selected Design</label>
                  <p className="font-bold text-wine m-0">{designName}</p>
                  <p className="text-xs text-inksoft mt-1">This has been added to your request description below.</p>
                </div>
              )}

              <h3 className="font-display text-lg text-winedark mb-3.5">Customer Information</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Full Name" required>
                  <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" required />
                </Field>
                <Field label="Phone Number" required>
                  <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="10-digit phone number" required />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="WhatsApp Number" required>
                  <input className="input" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="WhatsApp number" required />
                </Field>
                <Field label="Email (optional)">
                  <input type="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
                </Field>
              </div>

              <h3 className="font-display text-lg text-winedark mt-7 mb-3.5 pt-5 border-t border-line">Service Information</h3>
              <Field label="Select Service" required>
                <select className="input" value={form.serviceSlug} onChange={(e) => update('serviceSlug', e.target.value)} required>
                  <option value="">Choose a service…</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Description of Required Work" required>
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe what needs to be done…"
                  required
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Preferred Completion Date">
                  <input type="date" className="input" value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} />
                </Field>
                <Field label="Optional Budget (₹)">
                  <input type="number" className="input" value={form.budget} onChange={(e) => update('budget', e.target.value)} placeholder="e.g. 800" />
                </Field>
              </div>

              <h3 className="font-display text-lg text-winedark mt-7 mb-1 pt-5 border-t border-line">Saree Photos</h3>
              <p className="text-xs text-inksoft mb-2.5">Please upload clear photos showing the area that needs work.</p>
              <ImageUploader images={images} onChange={setImages} />

              <label className="flex items-start gap-2.5 mt-4 text-sm text-inksoft cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-wine flex-none"
                />
                <span>
                  I agree that the photographs I upload may be used by Saree Craft Studio for
                  marketing purposes, including showcasing our work on our website and social
                  media.
                </span>
              </label>

              <div className="mt-7 pt-5 border-t border-line">
                <label className="flex items-start gap-2.5 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToPolicies}
                    onChange={(e) => setAgreedToPolicies(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 accent-wine flex-none"
                  />
                  <span>
                    I have read and agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-wine underline font-bold">Terms &amp; Conditions</Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="text-wine underline font-bold">Privacy Policy</Link>.
                  </span>
                </label>
                <p className="text-xs text-inksoft mt-3">
                  Please note: Submitting this form is only a request for inspection/quotation. It
                  does not confirm an order.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting || !agreedToPolicies}
                  className="bg-wine hover:bg-winedark disabled:opacity-50 disabled:cursor-not-allowed text-ivory font-bold px-6 py-3.5 rounded-full transition-colors"
                >
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
                <a
                  href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello, I have a question before submitting a service request.')}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-wine text-wine font-bold px-6 py-3.5 rounded-full"
                >
                  Ask on WhatsApp instead
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1.5">
        {label} {required && <span className="text-wine">*</span>}
      </label>
      {children}
    </div>
  )
}
