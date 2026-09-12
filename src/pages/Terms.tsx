import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / Terms &amp; Conditions
          </div>
          <h1 className="font-display text-4xl text-winedark">Terms &amp; Conditions</h1>
          <p className="text-inksoft mt-2.5">Last Updated: 27 August 2026</p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Prominent washing warning */}
          <div className="bg-wine text-ivory rounded-xl2 p-5 sm:p-6 mb-10 border-2 border-gold">
            <p className="font-display text-lg sm:text-xl leading-snug">
              ⚠️ IMPORTANT: PLEASE WASH YOUR SAREE BEFORE GIVING IT TO US.
            </p>
            <p className="font-bold mt-2">WE DO NOT WASH SAREES AS PART OF OUR SERVICE.</p>
            <p className="mt-2 text-ivory/90">
              Please provide your saree to us in a clean and washed condition before the requested
              work begins.
            </p>
          </div>

          <div className="text-inksoft leading-relaxed">
            <p>
              These Terms &amp; Conditions govern your use of this website and any service request
              submitted to Saree Craft Studio ("we", "us", "our"). By submitting a service request,
              you agree to these Terms.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">1. Our Services</h2>
            <p>
              Saree Craft Studio provides saree decoration, finishing and customisation services,
              including services such as tassel work, polishing, decoration, finishing, alteration,
              and other offered saree/garment services.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">2. Service Requests Are Not Confirmed Orders</h2>
            <p>
              When you submit a request through the Request a Service form, this is only a request
              for inspection, assessment and/or quotation. Submitting the form does <strong>not</strong>{' '}
              automatically create a confirmed order. We review your request, photographs and
              requirements, and determine whether the work can be performed, before any order is
              confirmed.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">3. Quotation &amp; Pricing</h2>
            <p>
              Pricing may depend on the requested work, the condition of the saree or garment,
              materials required, complexity, and your specific requirements. A final price will be
              shared with you before work begins.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">4. Our Right to Decline a Request</h2>
            <p>
              We reserve the right to decline any service request at our discretion, including but
              not limited to requests that are unclear, technically not feasible, involve fabric or
              garments that are too damaged or fragile to safely work on, require work outside the
              services we provide, or otherwise cannot reasonably be completed by us.
            </p>
            <p className="mt-3">
              If we decline a request, we will inform you and no service charge will apply for work
              that has not been performed.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">5. Your Responsibilities</h2>
            <p>You are responsible for providing accurate information about your saree or garment, its condition, the requested work, and any special instructions. Please disclose any known damage, tears, stains, weak fabric, previous repairs, colour issues, age-related deterioration, or other relevant condition of the item.</p>
            <p className="mt-3">
              You are also responsible for ensuring you have the right to upload and share any
              photographs you provide to us.
            </p>

            <div className="bg-ivorydeep border border-gold rounded-xl2 p-5 my-6">
              <p className="font-bold text-winedark">
                ⚠️ Please wash your saree before giving it to us. We do not wash sarees as part of
                our service — items must be provided in a clean, washed condition.
              </p>
            </div>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">6. Photographs You Upload</h2>
            <p>
              Photographs you upload may be used by us to assess your saree, understand its
              condition, determine feasibility, prepare a quotation or inspection, and help the
              relevant worker understand the requested work.
            </p>
            <p className="mt-3">
              We do not use your photographs for marketing unless you separately agree to this via
              the optional marketing-consent checkbox on the Request a Service form. You retain
              ownership of any photographs you upload.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">7. Cancellations</h2>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong>Before work begins:</strong> you may request cancellation before work on your saree has started.</li>
              <li><strong>After work begins:</strong> cancellation is generally not available once work has started, as time, labour, materials and resources may already have been committed.</li>
              <li><strong>After completion:</strong> cancellation or refund is generally not available once the requested service has been completed, subject to any rights that cannot legally be excluded.</li>
            </ul>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">8. Service Hours</h2>
            <p>
              Our service hours are <strong>9:00 AM to 11:00 PM</strong>. Requests or messages sent
              outside these hours may be responded to during our next available service period.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">9. Risks Associated With Textile Work</h2>
            <p>
              Old, delicate, fragile or previously damaged sarees can carry inherent risks.
              Existing damage, weak fabric, loose threads, colour issues, previous repairs and
              age-related deterioration may affect the outcome of any work carried out.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">10. Limitation of Liability</h2>
            <p>
              We take reasonable care when handling sarees and garments entrusted to us. However,
              textile work can involve inherent risks, particularly where a saree or garment is
              old, delicate, fragile, previously damaged, or affected by pre-existing defects.
            </p>
            <p className="mt-3">
              We are not responsible for damage or issues caused solely by pre-existing conditions,
              undisclosed damage, inaccurate information supplied by the customer, or
              characteristics of the fabric that could not reasonably be identified beforehand.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by applicable law, our liability in relation to a
              service will be limited to the extent legally permissible.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">11. Complaints &amp; Disputes</h2>
            <p>
              If you are unhappy with completed work, please contact us within 7 days of delivery
              by phone or WhatsApp so we can review the matter. Please provide relevant service
              details, photographs, and a description of the issue where possible.
            </p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">12. Contact Us</h2>
            <p>Email: <span className="font-bold text-wine">saree.craft.studio@gmail.com</span></p>
            <p className="mt-1.5">Phone / WhatsApp: as shown in the contact information on this website.</p>
            <p className="mt-1.5">Service hours: 9:00 AM to 11:00 PM.</p>

            <h2 className="font-display text-2xl text-winedark mt-9 mb-3">13. Acceptance of These Terms</h2>
            <p>
              By submitting a service request, you acknowledge that you have read and agree to
              these Terms &amp; Conditions and our{' '}
              <Link to="/privacy" className="text-wine font-bold underline">Privacy Policy</Link>,
              that a submitted request is not automatically a confirmed order, that you understand
              the saree-washing requirement above, and that you understand our cancellation and
              refund practices as described in Section 7.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
