import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSettings } from '../contexts/SettingsContext'

export default function About() {
  const { settings } = useSettings()
  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / About
          </div>
          <h1 className="font-display text-4xl text-winedark">About Us</h1>
        </div>
      </div>
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/3] rounded-xl2 bg-gradient-to-br from-winedark to-gold flex items-center justify-center">
            <span className="text-ivory/90 border border-ivory/60 rounded-full px-4 py-2 text-xs uppercase tracking-wide">
              Studio / Workshop Photo
            </span>
          </div>
          <div>
            <h2 className="font-display text-2xl text-winedark">Careful saree finishing, made personal</h2>
            <p className="text-inksoft text-lg mt-3.5">
              {settings.business_name} specialises in saree tassel work, polishing, repair, alteration, blouse making and
              custom saree services. We work closely with each customer to understand what their saree needs, and
              communicate pricing clearly before any work begins.
            </p>
            {settings.homepage_text && <p className="text-inksoft text-lg mt-3.5">{settings.homepage_text}</p>}
          </div>
        </div>
      </section>
      <section className="py-14 bg-ivorydeep">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-6">
          {[
            ['Our Approach', 'Inspect before we quote', 'We look at your saree and requirement first, so pricing reflects the actual work needed.'],
            ['Our Craft', 'Hand-finished detail', 'Tassels, borders and repairs are finished by hand for a natural result.'],
            ['Our Promise', 'Clear communication', "You'll know the price and timeline before we begin any work."],
          ].map(([tag, title, body]) => (
            <div key={title} className="p-6 rounded-xl2 bg-white border border-line">
              <div className="font-display text-gold text-sm font-semibold">{tag}</div>
              <h4 className="mt-2 font-semibold">{title}</h4>
              <p className="mt-2 text-sm text-inksoft">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
