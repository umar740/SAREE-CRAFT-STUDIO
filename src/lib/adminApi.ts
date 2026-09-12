import { supabase } from './supabase'
import type { Service, ServiceDesign, Showcase, ShowcaseImage, ServiceRequest, Customer, Testimonial, FAQ, SiteSettings } from './types'

// ---------- Dashboard ----------
export async function getDashboardCounts() {
  const [newC, activeC, readyC, deliveredC, pendingPayC, customersC] = await Promise.all([
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).in('status', ['contacted', 'quotation_sent', 'approved', 'saree_received', 'in_progress']),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('status', 'ready'),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('status', 'delivered'),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).in('payment_status', ['not_paid', 'advance_paid', 'partially_paid']),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
  ])
  return {
    newRequests: newC.count || 0,
    activeJobs: activeC.count || 0,
    readyForDelivery: readyC.count || 0,
    completedJobs: deliveredC.count || 0,
    pendingPayments: pendingPayC.count || 0,
    totalCustomers: customersC.count || 0,
  }
}

// ---------- Requests ----------
export async function getAllRequests(): Promise<ServiceRequest[]> {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*, customers(*), services(*), service_designs(*), request_images(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as ServiceRequest[]) || []
}

export async function updateRequest(id: string, patch: Partial<ServiceRequest>) {
  const { error } = await supabase.from('service_requests').update(patch).eq('id', id)
  if (error) throw error
}

export async function getSignedRequestImageUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from('customer-uploads').createSignedUrl(path, 3600)
  if (error) return null
  return data.signedUrl
}

// ---------- Customers ----------
export async function getAllCustomers(): Promise<(Customer & { request_count?: number })[]> {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data as Customer[]) || []
}

// ---------- Services ----------
export async function getAllServicesAdmin(): Promise<Service[]> {
  const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true })
  if (error) throw error
  return (data as Service[]) || []
}
export async function createService(payload: Partial<Service>) {
  const { error } = await supabase.from('services').insert(payload)
  if (error) throw error
}
export async function updateService(id: string, payload: Partial<Service>) {
  const { error } = await supabase.from('services').update(payload).eq('id', id)
  if (error) throw error
}
export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

// ---------- Service designs ----------
export async function getDesignsForService(serviceId: string): Promise<ServiceDesign[]> {
  const { data, error } = await supabase.from('service_designs').select('*').eq('service_id', serviceId).order('display_order')
  if (error) throw error
  return (data as ServiceDesign[]) || []
}
export async function createDesign(payload: Partial<ServiceDesign>) {
  const { error } = await supabase.from('service_designs').insert(payload)
  if (error) throw error
}
export async function updateDesign(id: string, payload: Partial<ServiceDesign>) {
  const { error } = await supabase.from('service_designs').update(payload).eq('id', id)
  if (error) throw error
}
export async function deleteDesign(id: string) {
  const { error } = await supabase.from('service_designs').delete().eq('id', id)
  if (error) throw error
}

// ---------- Showcases ----------
export async function getAllShowcasesAdmin(): Promise<Showcase[]> {
  const { data, error } = await supabase
    .from('showcases')
    .select('*, showcase_images(*)')
    .order('display_order', { ascending: true })
  if (error) throw error
  return (data as Showcase[]) || []
}
export async function createShowcase(payload: Partial<Showcase>) {
  const { data, error } = await supabase.from('showcases').insert(payload).select().single()
  if (error) throw error
  return data as Showcase
}
export async function updateShowcase(id: string, payload: Partial<Showcase>) {
  const { error } = await supabase.from('showcases').update(payload).eq('id', id)
  if (error) throw error
}
export async function deleteShowcase(id: string) {
  const { error } = await supabase.from('showcases').delete().eq('id', id)
  if (error) throw error
}
export async function addShowcaseImage(payload: Partial<ShowcaseImage>) {
  const { error } = await supabase.from('showcase_images').insert(payload)
  if (error) throw error
}
export async function deleteShowcaseImage(id: string) {
  const { error } = await supabase.from('showcase_images').delete().eq('id', id)
  if (error) throw error
}

// ---------- Testimonials ----------
export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data as Testimonial[]) || []
}
export async function createTestimonial(payload: Partial<Testimonial>) {
  const { error } = await supabase.from('testimonials').insert(payload)
  if (error) throw error
}
export async function updateTestimonial(id: string, payload: Partial<Testimonial>) {
  const { error } = await supabase.from('testimonials').update(payload).eq('id', id)
  if (error) throw error
}
export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

// ---------- FAQs ----------
export async function getAllFaqsAdmin(): Promise<FAQ[]> {
  const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true })
  if (error) throw error
  return (data as FAQ[]) || []
}
export async function createFaq(payload: Partial<FAQ>) {
  const { error } = await supabase.from('faqs').insert(payload)
  if (error) throw error
}
export async function updateFaq(id: string, payload: Partial<FAQ>) {
  const { error } = await supabase.from('faqs').update(payload).eq('id', id)
  if (error) throw error
}
export async function deleteFaq(id: string) {
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw error
}

// ---------- Settings ----------
export async function updateSiteSettings(payload: Partial<SiteSettings>) {
  const { error } = await supabase.from('site_settings').update(payload).eq('id', 1)
  if (error) throw error
}
