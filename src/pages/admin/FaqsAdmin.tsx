import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'
import { getAllFaqsAdmin, createFaq, updateFaq, deleteFaq } from '../../lib/adminApi'
import type { FAQ } from '../../lib/types'

const BLANK = { question: '', answer: '', display_order: 0, is_published: true }

export default function FaqsAdmin() {
  const [items, setItems] = useState<FAQ[] | null>(null)
  const [editing, setEditing] = useState<FAQ | typeof BLANK | null>(null)
  const { showToast } = useToast()

  function load() {
    getAllFaqsAdmin().then(setItems).catch(() => setItems([]))
  }
  useEffect(load, [])

  async function handleSave() {
    if (!editing) return
    try {
      if ('id' in editing) await updateFaq(editing.id, editing)
      else await createFaq(editing)
      setEditing(null)
      load()
      showToast('FAQ saved.')
    } catch (e: any) {
      showToast(e.message || 'Could not save.', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await deleteFaq(id)
    load()
    showToast('FAQ deleted.')
  }

  async function togglePublish(f: FAQ) {
    await updateFaq(f.id, { is_published: !f.is_published })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-display text-2xl text-winedark">FAQs</h1>
        <button onClick={() => setEditing({ ...BLANK })} className="bg-wine text-ivory text-sm font-bold px-4 py-2.5 rounded-full">+ Add FAQ</button>
      </div>
      <div className="bg-white border border-line rounded-xl2 p-5.5">
        {items === null ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <p className="text-sm text-inksoft">No FAQs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-line">
                  <th className="py-2.5 pr-3">Question</th>
                  <th className="py-2.5 pr-3">Order</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold max-w-sm">{f.question}</td>
                    <td className="py-3 pr-3">{f.display_order}</td>
                    <td className="py-3 pr-3">
                      <button onClick={() => togglePublish(f)} className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${f.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                        {f.is_published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 pr-3 flex gap-2">
                      <button onClick={() => setEditing(f)} className="border border-wine text-wine text-xs font-bold px-3 py-1.5 rounded-full">Edit</button>
                      <button onClick={() => handleDelete(f.id)} className="border border-red-300 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">Delete</button>
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
            <h3 className="font-display text-lg text-winedark mb-4">{'id' in editing ? 'Edit' : 'Add'} FAQ</h3>
            <div className="mb-3.5">
              <label className="block text-xs font-bold mb-1.5">Question</label>
              <input className="input" value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
            </div>
            <div className="mb-3.5">
              <label className="block text-xs font-bold mb-1.5">Answer</label>
              <textarea className="input min-h-[90px]" value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} />
            </div>
            <div className="mb-3.5">
              <label className="block text-xs font-bold mb-1.5">Display Order</label>
              <input type="number" className="input" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
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
