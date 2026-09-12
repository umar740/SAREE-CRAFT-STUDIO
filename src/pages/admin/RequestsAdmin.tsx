import { useEffect, useMemo, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'
import { getAllRequests, updateRequest, getSignedRequestImageUrl } from '../../lib/adminApi'
import { STATUS_LABELS, PAYMENT_LABELS, statusBadgeClasses, paymentBadgeClasses, formatPrice, formatDateTime } from '../../lib/utils'
import type { ServiceRequest } from '../../lib/types'

const STATUS_OPTIONS = Object.keys(STATUS_LABELS)
const PAYMENT_OPTIONS = Object.keys(PAYMENT_LABELS)

export default function RequestsAdmin() {
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [selected, setSelected] = useState<ServiceRequest | null>(null)
  const { showToast } = useToast()

  function load() {
    getAllRequests().then(setRequests).catch(() => setRequests([]))
  }
  useEffect(load, [])

  const filtered = useMemo(() => {
    if (!requests) return []
    return requests.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.request_number?.toLowerCase().includes(q) ||
        r.customers?.name?.toLowerCase().includes(q) ||
        r.customers?.phone?.toLowerCase().includes(q) ||
        r.services?.name?.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || r.status === statusFilter
      const matchesPayment = !paymentFilter || r.payment_status === paymentFilter
      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [requests, search, statusFilter, paymentFilter])

  return (
    <div>
      <h1 className="font-display text-2xl text-winedark mb-5">Requests</h1>

      <div className="bg-white border border-line rounded-xl2 p-5.5">
        <div className="flex flex-wrap gap-2.5 justify-between mb-4">
          <input
            className="input max-w-xs"
            placeholder="Search by request #, name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <select className="input" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="">All payments</option>
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>{PAYMENT_LABELS[p]}</option>
              ))}
            </select>
          </div>
        </div>

        {requests === null ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-inksoft">No service requests match.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-line">
                  <th className="py-2.5 pr-3">Request</th>
                  <th className="py-2.5 pr-3">Customer</th>
                  <th className="py-2.5 pr-3">Service</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5 pr-3">Price</th>
                  <th className="py-2.5 pr-3">Payment</th>
                  <th className="py-2.5 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold">{r.request_number}</td>
                    <td className="py-3 pr-3">{r.customers?.name || '—'}</td>
                    <td className="py-3 pr-3">{r.services?.name || '—'}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${statusBadgeClasses(r.status)}`}>{STATUS_LABELS[r.status]}</span>
                    </td>
                    <td className="py-3 pr-3">{r.quoted_price ? formatPrice(r.quoted_price) : '—'}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${paymentBadgeClasses(r.payment_status)}`}>{PAYMENT_LABELS[r.payment_status]}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <button onClick={() => setSelected(r)} className="border border-wine text-wine text-xs font-bold px-3.5 py-1.5 rounded-full">
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <RequestDetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            load()
            showToast('Request updated.')
          }}
        />
      )}
    </div>
  )
}

function RequestDetailModal({
  request,
  onClose,
  onSaved,
}: {
  request: ServiceRequest
  onClose: () => void
  onSaved: () => void
}) {
  const { showToast } = useToast()
  const [status, setStatus] = useState(request.status)
  const [paymentStatus, setPaymentStatus] = useState(request.payment_status)
  const [quotedPrice, setQuotedPrice] = useState(request.quoted_price?.toString() || '')
  const [advanceAmount, setAdvanceAmount] = useState(request.advance_amount?.toString() || '')
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || '')
  const [saving, setSaving] = useState(false)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    ;(request.request_images || []).forEach(async (img) => {
      const url = await getSignedRequestImageUrl(img.image_url)
      if (url) setImageUrls((prev) => ({ ...prev, [img.id]: url }))
    })
  }, [request])

  async function handleSave() {
    setSaving(true)
    try {
      await updateRequest(request.id, {
        status,
        payment_status: paymentStatus,
        quoted_price: quotedPrice ? Number(quotedPrice) : null,
        advance_amount: advanceAmount ? Number(advanceAmount) : null,
        admin_notes: adminNotes || null,
      })
      onSaved()
      onClose()
    } catch (e: any) {
      showToast(e.message || 'Could not save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl2 max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-7">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-inksoft">{formatDateTime(request.created_at)}</span>
            <h2 className="font-display text-2xl text-winedark">{request.request_number}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-ivorydeep">✕</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-5">
          <div className="bg-ivorydeep rounded-lg p-3.5">
            <div className="text-xs font-bold text-inksoft mb-1">Customer</div>
            <div className="font-semibold">{request.customers?.name}</div>
            <div>{request.customers?.phone}</div>
            <div>WhatsApp: {request.customers?.whatsapp}</div>
            {request.customers?.email && <div>{request.customers.email}</div>}
          </div>
          <div className="bg-ivorydeep rounded-lg p-3.5">
            <div className="text-xs font-bold text-inksoft mb-1">Service</div>
            <div className="font-semibold">{request.services?.name || '—'}</div>
            {request.service_designs?.name && <div>Design: {request.service_designs.name}</div>}
            {request.preferred_date && <div>Preferred date: {request.preferred_date}</div>}
            {request.budget && <div>Budget: {formatPrice(request.budget)}</div>}
          </div>
        </div>

        <div className="mb-5">
          <div className="text-xs font-bold text-inksoft mb-1">Customer Description</div>
          <p className="text-sm bg-ivorydeep rounded-lg p-3.5">{request.description}</p>
        </div>

        {request.request_images && request.request_images.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-bold text-inksoft mb-2">Uploaded Photos</div>
            <div className="flex flex-wrap gap-2.5">
              {request.request_images.map((img) => (
                <a key={img.id} href={imageUrls[img.id] || '#'} target="_blank" rel="noreferrer" className="w-20 h-20 rounded-lg overflow-hidden bg-ivorydeep block">
                  {imageUrls[img.id] ? <img src={imageUrls[img.id]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">…</div>}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Payment Status</label>
            <select className="input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as any)}>
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>{PAYMENT_LABELS[p]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Quoted Price (₹)</label>
            <input className="input" type="number" value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Advance Amount (₹)</label>
            <input className="input" type="number" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold mb-1.5">Internal Admin Notes</label>
          <textarea className="input min-h-[80px]" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <button disabled={saving} onClick={handleSave} className="bg-wine hover:bg-winedark disabled:opacity-50 text-ivory font-bold px-6 py-3 rounded-full">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="border border-line text-inksoft font-bold px-6 py-3 rounded-full">Close</button>
        </div>
      </div>
    </div>
  )
}
