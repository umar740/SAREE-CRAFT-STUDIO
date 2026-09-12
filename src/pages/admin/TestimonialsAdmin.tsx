import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'
import { getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial } from '../../lib/adminApi'
import type { Testimonial } from '../../lib/types'

const BLANK = { customer_name: '', review: '', rating: 5, is_published: false }

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[] | null>(null)
  const [editing, setEditing] = useState<Testimonial | typeof BLANK | null>(null)
  const { showToast } = useToast()

  function load() {
    getAllTestimonialsAdmin().then(setItems).catch(() => setItems([]))
  }
  useEffect(load, [])

  async function handleSave() {
    if (!editing) return
    try {
      if ('id' in editing) {
        await updateTestimonial(editing.id, editing)
      } else {
        await createTestimonial(editing)
      }
      setEditing(null)
      load()
      showToast('Testimonial saved.')
    } catch (e: any) {
      showToast(e.message || 'Could not save.', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await deleteTestimonial(id)
    load()
    showToast('Testimonial deleted.')
  }

  async function togglePublish(t: Testimonial) {
    await updateTestimonial(t.id, { is_published: !t.is_published })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-display text-2xl text-winedark">Testimonials</h1>
        <button onClick={() => setEditing({ ...BLANK })} className="bg-wine text-ivory text-sm font-bold px-4 py-2.5 rounded-full">+ Add Review</button>
      </div>

      <div className="bg-white border border-line rounded-xl2 p-5.5">
        {items === null ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <p className="text-sm text-inksoft">No testimonials yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-line">
                  <th className="py-2.5 pr-3">Customer</th>
                  <th className="py-2.5 pr-3">Rating</th>
                  <th className="py-2.5 pr-3">Review</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold">{t.customer_name}</td>
                    <td className="py-3 pr-3">{'★'.repeat(t.rating)}</td>
                    <td className="py-3 pr-3 max-w-xs truncate">{t.review}</td>
                    <td className="py-3 pr-3">
                      <button onClick={() => togglePublish(t)} className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${t.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                        {t.is_published ? 'Published' : 'Unpublished'}
                      </button>
                    </td>
                    <td className="py-3 pr-3 flex gap-2">
                      <button onClick={() => setEditing(t)} className="border border-wine text-wine text-xs font-bold px-3 py-1.5 rounded-full">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="border border-red-300 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div className="bg-white rounded-xl2 max-w-md w-full p-6">
            <h3 className="font-display text-lg text-winedark mb-4">{'id' in editing ? 'Edit' : 'Add'} Testimonial</h3>
            <div className="mb-3.5">
              <label className="block text-xs font-bold mb-1.5">Customer Name</label>
              <input className="input" value={editing.customer_name} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} />
            </div>
            <div className="mb-3.5">
              <label className="block text-xs font-bold mb-1.5">Review</label>
              <textarea className="input min-h-[90px]" value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} />
            </div>
            <div className="mb-3.5">
              <label className="block text-xs font-bold mb-1.5">Rating</label>
              <select className="input" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-5">
              <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
              Published (visible on site)
            </label>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-wine text-ivory font-bold px-5 py-2.5 rounded-full">Save</button>
              <button onClick={() => setEditing(null)} className="border border-line text-inksoft font-bold px-5 py-2.5 rounded-full">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
