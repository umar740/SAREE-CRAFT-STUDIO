import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-winedark">Page Not Found</h1>
        <p className="text-inksoft mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block mt-5 bg-wine text-ivory font-bold px-6 py-3 rounded-full">Back to Home</Link>
      </div>
      <Footer />
    </div>
  )
}
