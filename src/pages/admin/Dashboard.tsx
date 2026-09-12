import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getDashboardCounts, getAllRequests } from '../../lib/adminApi'
import { STATUS_LABELS, PAYMENT_LABELS, statusBadgeClasses, paymentBadgeClasses, formatPrice } from '../../lib/utils'
import type { ServiceRequest } from '../../lib/types'

export default function Dashboard() {
  const [counts, setCounts] = useState<Awaited<ReturnType<typeof getDashboardCounts>> | null>(null)
  const [recent, setRecent] = useState<ServiceRequest[] | null>(null)

  useEffect(() => {
    getDashboardCounts().then(setCounts)
    getAllRequests().then((r) => setRecent(r.slice(0, 6)))
  }, [])

  const cards = counts
    ? [
        ['New Requests', counts.newRequests],
        ['Active Jobs', counts.activeJobs],
        ['Ready for Delivery', counts.readyForDelivery],
        ['Completed Jobs', counts.completedJobs],
        ['Pending Payments', counts.pendingPayments],
        ['Total Customers', counts.totalCustomers],
      ]
    : []

  return (
    <div>
      <h1 className="font-display text-2xl text-winedark mb-5">Dashboard</h1>
      {!counts ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {cards.map(([label, value]) => (
            <div key={label as string} className="bg-white border border-line rounded-xl2 p-4.5">
              <div className="font-display text-2xl text-winedark">{value}</div>
              <div className="text-xs font-bold text-inksoft mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-line rounded-xl2 p-5.5 mt-6">
        <h3 className="font-semibold mb-3">Recent Requests</h3>
        {recent === null ? (
          <LoadingSpinner />
        ) : recent.length === 0 ? (
          <p className="text-sm text-inksoft">No service requests yet.</p>
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
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-line hover:bg-ivorydeep">
                    <td className="py-3 pr-3 font-semibold">
                      <Link to="/admin/requests" className="text-wine">{r.request_number}</Link>
                    </td>
                    <td className="py-3 pr-3">{r.customers?.name || '—'}</td>
                    <td className="py-3 pr-3">{r.services?.name || '—'}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${statusBadgeClasses(r.status)}`}>{STATUS_LABELS[r.status]}</span>
                    </td>
                    <td className="py-3 pr-3">{r.quoted_price ? formatPrice(r.quoted_price) : '—'}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${paymentBadgeClasses(r.payment_status)}`}>{PAYMENT_LABELS[r.payment_status]}</span>
                    </td>
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
