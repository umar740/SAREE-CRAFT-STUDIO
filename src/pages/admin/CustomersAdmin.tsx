import { useEffect, useMemo, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAllCustomers } from '../../lib/adminApi'
import type { Customer } from '../../lib/types'

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[] | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllCustomers().then(setCustomers).catch(() => setCustomers([]))
  }, [])

  const filtered = useMemo(() => {
    if (!customers) return []
    const q = search.toLowerCase()
    return customers.filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q))
  }, [customers, search])

  return (
    <div>
      <h1 className="font-display text-2xl text-winedark mb-5">Customers</h1>
      <div className="bg-white border border-line rounded-xl2 p-5.5">
        <input className="input max-w-xs mb-4" placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {customers === null ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-inksoft">No customers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-line">
                  <th className="py-2.5 pr-3">Name</th>
                  <th className="py-2.5 pr-3">Phone</th>
                  <th className="py-2.5 pr-3">WhatsApp</th>
                  <th className="py-2.5 pr-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold">{c.name}</td>
                    <td className="py-3 pr-3">{c.phone}</td>
                    <td className="py-3 pr-3">{c.whatsapp || '—'}</td>
                    <td className="py-3 pr-3">{c.email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
