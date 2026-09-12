import { Link } from 'react-router-dom'
import type { Service } from '../lib/types'
import { formatStartingPrice } from '../lib/utils'

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white border border-line rounded-xl2 overflow-hidden shadow-card flex flex-col transition-transform hover:-translate-y-1">
      <Link to={`/services/${service.slug}`} className="block h-44 bg-ivorydeep">
        {service.image_url ? (
          <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-inksoft text-sm">No image yet</div>
        )}
      </Link>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg text-winedark">{service.name}</h3>
        {service.what_can_do?.length ? (
          <span className="text-xs font-bold text-teal uppercase tracking-wide">
            {/* placeholder for design count, filled by caller via designCount prop pattern kept simple here */}
          </span>
        ) : null}
        <p className="text-sm text-inksoft flex-1 line-clamp-3">{service.short_description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-extrabold text-gold">{formatStartingPrice(service.starting_price)}</span>
          <Link
            to={`/services/${service.slug}`}
            className="text-xs font-bold border border-wine text-wine rounded-full px-4 py-2 hover:bg-wine hover:text-ivory transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
