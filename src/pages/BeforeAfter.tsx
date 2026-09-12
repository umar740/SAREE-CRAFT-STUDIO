import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { getPublishedShowcases } from '../lib/api'
import type { Showcase } from '../lib/types'

const CATS = ['All', 'Tassel Work', 'Polish', 'Repair', 'Alteration', 'Blouse', 'Custom Work']

export default function BeforeAfter() {
  const [showcases, setShowcases] = useState<Showcase[] | null>(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    setShowcases(null)
    getPublishedShowcases({ category: filter }).then(setShowcases).catch(() => setShowcases([]))
  }, [filter])

  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / Before &amp; After
          </div>
          <h1 className="font-display text-4xl text-winedark">Before &amp; After</h1>
          <p className="text-inksoft mt-2.5 max-w-lg">Drag the divider on any image to see the transformation.</p>
        </div>
      </div>
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2.5 mb-8">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4.5 py-2.5 rounded-full border text-sm font-bold transition-colors ${
                  filter === c ? 'bg-wine border-wine text-ivory' : 'bg-white border-line text-inksoft hover:border-wine'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {showcases === null ? (
            <LoadingSpinner />
          ) : showcases.length === 0 ? (
            <EmptyState message="No work has been added yet for this category. Check back soon." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcases.map((sc) => {
                const before = sc.showcase_images?.find((i) => i.image_type === 'before')?.image_url
                const after = sc.showcase_images?.find((i) => i.image_type === 'after')?.image_url
                return (
                  <div key={sc.id} className="bg-white border border-line rounded-xl2 p-3.5 shadow-card">
                    {before && after ? (
                      <BeforeAfterSlider beforeUrl={before} afterUrl={after} alt={sc.title} />
                    ) : (
                      <div className="aspect-[4/3] rounded-xl bg-ivorydeep flex items-center justify-center text-inksoft text-sm">Images pending</div>
                    )}
                    <h4 className="font-display text-lg mt-3">{sc.title}</h4>
                    <span className="text-xs font-extrabold uppercase tracking-wide text-teal">{sc.category}</span>
                    <p className="text-sm text-inksoft mt-1.5">{sc.description}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
