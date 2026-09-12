import { useState, FormEvent, ReactNode } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { useSettings } from '../../contexts/SettingsContext'
import { updateSiteSettings } from '../../lib/adminApi'
import { uploadToBucket } from '../../lib/storage'

export default function SettingsAdmin() {
  const { settings, refresh } = useSettings()
  const { showToast } = useToast()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'hero' | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleImage(file: File | undefined, field: 'logo_url' | 'hero_image_url', which: 'logo' | 'hero') {
    if (!file) return
    setUploading(which)
    try {
      const url = await uploadToBucket('site-images', file)
      update(field, url)
    } catch (e: any) {
      showToast(e.message || 'Upload failed.', 'error')
    } finally {
      setUploading(null)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSiteSettings(form)
      await refresh()
      showToast('Settings saved.')
    } catch (err: any) {
      showToast(err.message || 'Could not save settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-winedark mb-5">Site Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-xl2 p-6 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Business Name">
            <input className="input" value={form.business_name} onChange={(e) => update('business_name', e.target.value)} />
          </Field>
          <Field label="Email">
            <input className="input" value={form.email || ''} onChange={(e) => update('email', e.target.value)} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Phone (display)">
            <input className="input" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
          </Field>
          <Field label="WhatsApp (display)">
            <input className="input" value={form.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} placeholder="+91 98765 43210" />
          </Field>
        </div>
        <Field label="WhatsApp Number — digits only, with country code (used for wa.me links)">
          <input className="input" value={form.whatsapp_digits || ''} onChange={(e) => update('whatsapp_digits', e.target.value)} placeholder="919876543210" />
        </Field>
        <Field label="Address">
          <input className="input" value={form.address || ''} onChange={(e) => update('address', e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Business Hours">
            <input className="input" value={form.business_hours || ''} onChange={(e) => update('business_hours', e.target.value)} placeholder="Mon-Sat, 10am - 7pm" />
          </Field>
          <Field label="Google Maps Link">
            <input className="input" value={form.maps_url || ''} onChange={(e) => update('maps_url', e.target.value)} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Instagram URL">
            <input className="input" value={form.instagram_url || ''} onChange={(e) => update('instagram_url', e.target.value)} />
          </Field>
          <Field label="Facebook URL">
            <input className="input" value={form.facebook_url || ''} onChange={(e) => update('facebook_url', e.target.value)} />
          </Field>
        </div>
        <Field label="Homepage / About Text (optional)">
          <textarea className="input min-h-[70px]" value={form.homepage_text || ''} onChange={(e) => update('homepage_text', e.target.value)} />
        </Field>
        <Field label="Footer Text (optional)">
          <textarea className="input min-h-[60px]" value={form.footer_text || ''} onChange={(e) => update('footer_text', e.target.value)} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-bold mb-1.5">Logo</label>
            {form.logo_url && <img src={form.logo_url} className="w-20 h-20 object-cover rounded-lg mb-2" />}
            <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0], 'logo_url', 'logo')} disabled={uploading === 'logo'} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">Hero Image</label>
            {form.hero_image_url && <img src={form.hero_image_url} className="w-full h-24 object-cover rounded-lg mb-2" />}
            <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0], 'hero_image_url', 'hero')} disabled={uploading === 'hero'} />
          </div>
        </div>

        <button disabled={saving} className="bg-wine hover:bg-winedark disabled:opacity-50 text-ivory font-bold px-6 py-3 rounded-full transition-colors">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1.5">{label}</label>
      {children}
    </div>
  )
}
