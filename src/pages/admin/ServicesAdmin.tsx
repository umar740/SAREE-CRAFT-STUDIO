import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'
import { uploadToBucket } from '../../lib/storage'
import { slugify, formatPrice } from '../../lib/utils'
import {
  getAllServicesAdmin, createService, updateService, deleteService,
  getDesignsForService, createDesign, updateDesign, deleteDesign,
} from '../../lib/adminApi'
import type { Service, ServiceDesign } from '../../lib/types'

const BLANK = {
  name: '', slug: '', short_description: '', description: '',
  what_can_do: [] as string[], starting_price: null as number | null,
  estimated_duration: '', image_url: '', is_active: true, display_order: 0,
}

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[] | null>(null)
  const [editing, setEditing] = useState<Service | typeof BLANK | null>(null)
  const [designsFor, setDesignsFor] = useState<Service | null>(null)
  const { showToast } = useToast()

  function load() {
    getAllServicesAdmin().then(setItems).catch(() => setItems([]))
  }
  useEffect(load, [])

  async function handleSave() {
    if (!editing) return
    try {
      const payload = { ...editing, slug: editing.slug || slugify(editing.name) }
      if ('id' in payload) await updateService(payload.id, payload)
      else await createService(payload)
      setEditing(null)
      load()
      showToast('Service saved.')
    } catch (e: any) {
      showToast(e.message || 'Could not save.', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service? This cannot be undone.')) return
    await deleteService(id)
    load()
    showToast('Service deleted.')
  }

  async function toggleActive(s: Service) {
    await updateService(s.id, { is_active: !s.is_active })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-display text-2xl text-winedark">Manage Services</h1>
        <button onClick={() => setEditing({ ...BLANK })} className="bg-wine text-ivory text-sm font-bold px-4 py-2.5 rounded-full">+ Add Service</button>
      </div>

      <div className="bg-white border border-line rounded-xl2 p-5.5">
        {items === null ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <p className="text-sm text-inksoft">No services yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-line">
                  <th className="py-2.5 pr-3">Service</th>
                  <th className="py-2.5 pr-3">Starting Price</th>
                  <th className="py-2.5 pr-3">Duration</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold">{s.name}</td>
                    <td className="py-3 pr-3">{formatPrice(s.starting_price)}</td>
                    <td className="py-3 pr-3">{s.estimated_duration || '—'}</td>
                    <td className="py-3 pr-3">
                      <button onClick={() => toggleActive(s)} className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                        {s.is_active ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 pr-3 flex flex-wrap gap-2">
                      <button onClick={() => setEditing(s)} className="border border-wine text-wine text-xs font-bold px-3 py-1.5 rounded-full">Edit</button>
                      <button onClick={() => setDesignsFor(s)} className="border border-teal text-teal text-xs font-bold px-3 py-1.5 rounded-full">Designs</button>
                      <button onClick={() => handleDelete(s.id)} className="border border-red-300 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <ServiceEditModal service={editing} onClose={() => setEditing(null)} onSave={handleSave} setEditing={setEditing} />}
      {designsFor && <DesignsModal service={designsFor} onClose={() => setDesignsFor(null)} />}
    </div>
  )
}

function ServiceEditModal({
  service, onClose, onSave, setEditing,
}: {
  service: Service | typeof BLANK
  onClose: () => void
  onSave: () => void
  setEditing: (s: any) => void
}) {
  const { showToast } = useToast()
  const [uploading, setUploading] = useState(false)

  async function handleImage(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToBucket('service-images', file)
      setEditing({ ...service, image_url: url })
    } catch (e: any) {
      showToast(e.message || 'Upload failed.', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl2 max-w-lg w-full p-6 max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-lg text-winedark mb-4">{'id' in service ? 'Edit' : 'Add'} Service</h3>

        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Name</label>
          <input className="input" value={service.name} onChange={(e) => setEditing({ ...service, name: e.target.value })} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Slug (URL)</label>
          <input className="input" value={service.slug} placeholder="auto-generated from name if left blank" onChange={(e) => setEditing({ ...service, slug: e.target.value })} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Short Description (for cards)</label>
          <textarea className="input min-h-[60px]" value={service.short_description} onChange={(e) => setEditing({ ...service, short_description: e.target.value })} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Full Description</label>
          <textarea className="input min-h-[80px]" value={service.description} onChange={(e) => setEditing({ ...service, description: e.target.value })} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">What We Can Do (one per line)</label>
          <textarea
            className="input min-h-[80px]"
            value={service.what_can_do.join('\n')}
            onChange={(e) => setEditing({ ...service, what_can_do: e.target.value.split('\n').filter(Boolean) })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="block text-xs font-bold mb-1.5">Starting Price (₹, optional)</label>
            <input
              type="number"
              className="input"
              value={service.starting_price ?? ''}
              placeholder="Leave blank = price on inspection"
              onChange={(e) => setEditing({ ...service, starting_price: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Estimated Duration</label>
            <input className="input" value={service.estimated_duration || ''} placeholder="e.g. 2-4 days" onChange={(e) => setEditing({ ...service, estimated_duration: e.target.value })} />
          </div>
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-bold mb-1.5">Image</label>
          {service.image_url && <img src={service.image_url} className="w-full h-32 object-cover rounded-lg mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} disabled={uploading} />
          {uploading && <p className="text-xs text-inksoft mt-1">Uploading…</p>}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold mb-5">
          <input type="checkbox" checked={service.is_active} onChange={(e) => setEditing({ ...service, is_active: e.target.checked })} />
          Published (visible on site)
        </label>

        <div className="flex gap-3">
          <button onClick={onSave} className="bg-wine text-ivory font-bold px-5 py-2.5 rounded-full">Save</button>
          <button onClick={onClose} className="border border-line text-inksoft font-bold px-5 py-2.5 rounded-full">Cancel</button>
        </div>
      </div>
    </div>
  )
}

const BLANK_DESIGN = { name: '', description: '', image_url: '', display_order: 0, is_active: true }

function DesignsModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [designs, setDesigns] = useState<ServiceDesign[] | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const { showToast } = useToast()

  function load() {
    getDesignsForService(service.id).then(setDesigns)
  }
  useEffect(load, [service.id])

  async function handleImage(file: File | undefined) {
    if (!file || !editing) return
    setUploading(true)
    try {
      const url = await uploadToBucket('service-images', file, 'designs')
      setEditing({ ...editing, image_url: url })
    } catch (e: any) {
      showToast(e.message || 'Upload failed.', 'error')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!editing) return
    try {
      if (editing.id) await updateDesign(editing.id, editing)
      else await createDesign({ ...editing, service_id: service.id })
      setEditing(null)
      load()
      showToast('Design saved.')
    } catch (e: any) {
      showToast(e.message || 'Could not save.', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this design?')) return
    await deleteDesign(id)
    load()
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl2 max-w-2xl w-full p-6 max-h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-lg text-winedark">Designs for {service.name}</h3>
          <button onClick={() => setEditing({ ...BLANK_DESIGN })} className="bg-wine text-ivory text-xs font-bold px-3.5 py-2 rounded-full">+ Add Design</button>
        </div>

        {designs === null ? (
          <LoadingSpinner />
        ) : designs.length === 0 ? (
          <p className="text-sm text-inksoft">No designs added for this service yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {designs.map((d) => (
              <div key={d.id} className="border border-line rounded-lg p-3 flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-ivorydeep flex-none overflow-hidden">
                  {d.image_url && <img src={d.image_url} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm truncate">{d.name}</div>
                  <p className="text-xs text-inksoft line-clamp-2">{d.description}</p>
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={() => setEditing(d)} className="text-xs font-bold text-wine">Edit</button>
                    <button onClick={() => handleDelete(d.id)} className="text-xs font-bold text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="mt-5 border-t border-line pt-5">
            <h4 className="font-semibold mb-3">{editing.id ? 'Edit' : 'Add'} Design</h4>
            <div className="mb-3">
              <label className="block text-xs font-bold mb-1.5">Name</label>
              <input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-bold mb-1.5">Description</label>
              <textarea className="input min-h-[60px]" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-bold mb-1.5">Image</label>
              {editing.image_url && <img src={editing.image_url} className="w-24 h-24 object-cover rounded-lg mb-2" />}
              <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} disabled={uploading} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-wine text-ivory font-bold px-5 py-2.5 rounded-full text-sm">Save</button>
              <button onClick={() => setEditing(null)} className="border border-line text-inksoft font-bold px-5 py-2.5 rounded-full text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="mt-5">
          <button onClick={onClose} className="border border-line text-inksoft font-bold px-5 py-2.5 rounded-full text-sm">Close</button>
        </div>
      </div>
    </div>
  )
}
