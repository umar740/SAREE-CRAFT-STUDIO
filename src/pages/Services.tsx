import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ServiceCard from '../components/ServiceCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getActiveServices } from '../lib/api'
import type { Service } from '../lib/types'

export default function Services() {
  const [services, setServices] = useState<Service[] | null>(null)

  useEffect(() => {
    getActiveServices().then(setServices).catch(() => setServices([]))
  }, [])

  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / Services
          </div>
          <h1 className="font-display text-4xl text-winedark">Our Services</h1>
          <p className="text-inksoft mt-2.5 max-w-lg">
            Every service below can be requested through our simple form — just choose a service and send us photos of your saree.
          </p>
        </div>
      </div>
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {services === null ? (
            <LoadingSpinner />
          ) : services.length === 0 ? (
            <p className="text-inksoft">No services published yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
