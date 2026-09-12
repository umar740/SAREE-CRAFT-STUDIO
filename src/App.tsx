import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import BeforeAfter from './pages/BeforeAfter'
import RequestService from './pages/RequestService'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import RequestsAdmin from './pages/admin/RequestsAdmin'
import CustomersAdmin from './pages/admin/CustomersAdmin'
import ServicesAdmin from './pages/admin/ServicesAdmin'
import BeforeAfterAdmin from './pages/admin/BeforeAfterAdmin'
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin'
import FaqsAdmin from './pages/admin/FaqsAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/before-after" element={<BeforeAfter />} />
      <Route path="/request" element={<RequestService />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requests" element={<RequestsAdmin />} />
        <Route path="customers" element={<CustomersAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="before-after" element={<BeforeAfterAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="faqs" element={<FaqsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
