import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'
import { uploadToBucket } from '../../lib/storage'
import {
  getAllShowcasesAdmin, createShowcase, updateShowcase, deleteShowcase,
  addShowcaseImage, deleteShowcaseImage, getAllServicesAdmin,
} from '../../lib/adminApi'
import type { Showcase, Service } from '../../lib/types'

const CATS = ['Tassel Work', 'Polish', 'Repair', 'Alteration', 'Blouse', 'Custom Work']
const BLANK = { title: '', category: 'Custom Work', description: '', service_id: null as string | null, starting_price: null as number | null, duration: '', is_published: true, display_order: 0 }

export default function BeforeAfterAdmin() {
  const [items, setItems] = useState<Showcase[] | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Showcase | typeof BLANK | null>(null)
  const { showToast } = useToast()

  function load() {
    getAllShowcasesAdmin().then(setItems).catch(() => setItems([]))
  }
  useEffect(() => {
    load()
    getAllServicesAdmin().then(setServices)
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this showcase and its images?')) return
    await deleteShowcase(id)
    load()
    showToast('Showcase deleted.')
  }

  async function togglePublish(s: Showcase) {
    await updateShowcase(s.id, { is_published: !s.is_published })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-display text-2xl text-winedark">Manage Before &amp; After</h1>
        <button onClick={() => setEditing({ ...BLANK })} className="bg-wine text-ivory text-sm font-bold px-4 py-2.5 rounded-full">+ Add Showcase</button>
      </div>

      <div className="bg-white border border-line rounded-xl2 p-5.5">
        {items === null ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <p className="text-sm text-inksoft">No showcases yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-line">
                  <th className="py-2.5 pr-3">Title</th>
                  <th className="py-2.5 pr-3">Category</th>
                  <th className="py-2.5 pr-3">Images</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold">{s.title}</td>
                    <td className="py-3 pr-3">{s.category}</td>
                    <td className="py-3 pr-3">{s.showcase_images?.length || 0}</td>
                    <td className="py-3 pr-3">
                      <button onClick={() => togglePublish(s)} className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${s.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                        {s.is_published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 pr-3 flex gap-2">
                      <button onClick={() => setEditing(s)} className="border border-wine text-wine text-xs font-bold px-3 py-1.5 rounded-full">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="border border-red-300 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ShowcaseEditModal
          showcase={editing}
          services={services}
          onClose={() => setEditing(null)}
          onSaved={() => {
            load()
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function ShowcaseEditModal({
  showcase, services, onClose, onSaved,
}: {
  showcase: Showcase | typeof BLANK
  services: Service[]
  onClose: () => void
  onSaved: () => void
}) {
  const { showToast } = useToast()
  const [form, setForm] = useState(showcase)
  const [saving, setSaving] = useState(false)
  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const isExisting = 'id' in showcase

  async function handleSaveDetails() {
    setSaving(true)
    try {
      if (isExisting) {
        await updateShowcase((form as Showcase).id, form)
      } else {
        const created = await createShowcase(form)
        setForm(created)
      }
      showToast('Showcase saved.')
      onSaved()
    } catch (e: any) {
      showToast(e.message || 'Could not save.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(file: File | undefined, type: 'before' | 'after' | 'additional') {
    if (!file) return
    if (!('id' in form)) {
      showToast('Please save the showcase details first, then add images.', 'error')
      return
    }
    setUploadingType(type)
    try {
      const url = await uploadToBucket('showcase-images', file, (form as Showcase).id)
      await addShowcaseImage({ showcase_id: (form as Showcase).id, image_type: type, image_url: url, display_order: 1 })
      showToast('Image uploaded.')
      onSaved()
    } catch (e: any) {
      showToast(e.message || 'Upload failed.', 'error')
    } finally {
      setUploadingType(null)
    }
  }

  const images = 'showcase_images' in form ? form.showcase_images || [] : []

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl2 max-w-lg w-full p-6 max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-lg text-winedark mb-4">{isExisting ? 'Edit' : 'Add'} Showcase</h3>

        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="block text-xs font-bold mb-1.5">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Linked Service</label>
            <select className="input" value={form.service_id || ''} onChange={(e) => setForm({ ...form, service_id: e.target.value || null })}>
              <option value="">None</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Description</label>
          <textarea className="input min-h-[70px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="block text-xs font-bold mb-1.5">Price (optional)</label>
            <input type="number" className="input" value={form.starting_price ?? ''} onChange={(e) => setForm({ ...form, starting_price: e.target.value ? Number(e.target.value) : null })} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Duration (optional)</label>
            <input className="input" value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold mb-4">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published (visible on site)
        </label>

        <button onClick={handleSaveDetails} disabled={saving} className="bg-wine text-ivory font-bold px-5 py-2.5 rounded-full text-sm mb-5">
          {saving ? 'Saving…' : isExisting ? 'Save Details' : 'Save & Continue to Add Images'}
        </button>

        {isExisting && (
          <div className="border-t border-line pt-5">
            <h4 className="font-semibold mb-3">Images</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {images.map((img) => (
                <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={img.image_url} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/55 text-white text-[9px] text-center py-0.5 uppercase font-bold">{img.image_type}</span>
                  <button
                    onClick={async () => {
                      await deleteShowcaseImage(img.id)
                      onSaved()
                    }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {(['before', 'after', 'additional'] as const).map((type) => (
                <div key={type}>
                  <label className="block font-bold mb-1 capitalize">{type}</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], type)} disabled={uploadingType === type} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="border border-line text-inksoft font-bold px-5 py-2.5 rounded-full text-sm">Close</button>
        </div>
      </div>
    </div>
  )
}
