import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div>
      <Navbar />
      <div className="bg-ivorydeep border-b border-line py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-inksoft mb-2">
            <Link to="/" className="text-wine">Home</Link> / Privacy Policy
          </div>
          <h1 className="font-display text-4xl text-winedark">Privacy Policy</h1>
          <p className="text-inksoft mt-2.5">Last Updated: 27 August 2026</p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-inksoft leading-relaxed">
          <p>
            Saree Craft Studio ("we", "us", "our") respects your privacy. This Privacy Policy
            explains what information we collect when you use this website or submit a service
            request, why we collect it, how it is stored, and who can access it.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">1. Information We Collect</h2>
          <p>
            We do not intentionally collect personal information simply because someone visits or
            browses this website. We only collect information when you choose to submit a service
            request through our Request a Service form. At that point, we may collect:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1.5">
            <li>Your name</li>
            <li>Phone number</li>
            <li>WhatsApp number, where provided or used for communication</li>
            <li>Email address, only if you choose to provide it with your request</li>
            <li>Address, where needed for the service</li>
            <li>Details about your saree or garment</li>
            <li>Details about the service or work you are requesting</li>
            <li>Any special instructions you provide</li>
            <li>Photographs of your saree or garment that you upload with the request</li>
          </ul>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">2. Why We Collect This Information</h2>
          <p>We use the information above to:</p>
          <ul className="list-disc pl-6 mt-3 space-y-1.5">
            <li>Understand your saree or garment and its condition</li>
            <li>Understand the work you'd like us to carry out</li>
            <li>Review the photographs you've uploaded</li>
            <li>Determine whether the requested work is technically feasible</li>
            <li>Assess your service request</li>
            <li>Prepare or discuss an inspection and/or quotation with you</li>
            <li>Contact you and clarify requirements</li>
            <li>Process and manage your service from start to finish</li>
            <li>Help the relevant administrator or worker understand the requested work</li>
          </ul>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">3. Communication via WhatsApp</h2>
          <p>
            We may use WhatsApp to communicate with you about your service request — including
            discussing requirements, photographs, quotations, service details, updates and
            completion. WhatsApp is a third-party communication platform operated by its own
            provider, and its own privacy policy and terms apply to any messages sent through it.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">4. Where Your Information Is Stored</h2>
          <p>
            Information submitted through this website is stored using Supabase, our database and
            storage provider. Photographs you upload with a service request are stored in a
            private storage area and are not intended to be publicly accessible.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">5. Who Can Access Your Information</h2>
          <p>
            Only authorized administrators and workers who need the information to process,
            manage, or complete your requested service have access to your information and
            uploaded photographs. Your information is not publicly accessible.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">6. Use of Photographs for Marketing</h2>
          <p>
            The photographs you upload with a service request are used to assess your saree,
            understand its condition, determine feasibility, and prepare a quotation — not for
            marketing, unless you separately agree to this.
          </p>
          <p className="mt-3">
            On the Request a Service form, there is a separate, optional checkbox where you may
            choose to allow us to use your uploaded photographs for marketing purposes — such as
            showcasing our work on our website, social media, or other promotional materials
            operated by Saree Craft Studio. This is entirely your choice, is not required to
            submit a request, and we do not use your photographs for marketing unless you have
            ticked this box.
          </p>
          <p className="mt-3">
            You retain ownership of any photographs you upload. We do not claim ownership of your
            photographs simply because they have been uploaded to us.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">7. How Long We Keep Your Information</h2>
          <p>
            Your information is stored using Supabase and may be retained for as long as
            reasonably necessary to process and manage your service, maintain relevant business
            records, resolve any disputes, meet applicable legal requirements, and fulfil the
            purposes described in this policy. Storage and deletion are subject to applicable
            Supabase policies and terms, and to the configuration of our Supabase project.
            Information may be deleted or removed in line with our applicable retention practices
            and legal requirements.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">8. Security</h2>
          <p>
            We take reasonable measures to protect your information, and customer-uploaded photos
            are stored in a private area rather than a public one. However, no method of
            electronic storage or transmission over the internet can be guaranteed to be
            completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">9. Third-Party Services We Use</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1.5">
            <li><strong>Supabase</strong> — for our database and file storage</li>
            <li><strong>WhatsApp</strong> — for communicating with you where used</li>
            <li><strong>Cloudflare</strong> — for hosting and deployment infrastructure, where applicable</li>
          </ul>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">10. Your Rights &amp; Contacting Us</h2>
          <p>
            If you have questions about your personal information, privacy concerns, or would like
            to request correction or deletion of your information where applicable, please contact
            us at:
          </p>
          <p className="mt-3 font-bold text-wine">saree.craft.studio@gmail.com</p>

          <h2 className="font-display text-2xl text-winedark mt-9 mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time as our practices, the services we
            use, or applicable legal requirements change. The "Last Updated" date at the top of
            this page reflects the most recent revision.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
