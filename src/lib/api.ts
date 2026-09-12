import { supabase } from './supabase'
import type { Service, ServiceDesign, Showcase, Testimonial, FAQ } from './types'

export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return (data as Service[]) || []
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).eq('is_active', true).single()
  if (error) return null
  return data as Service
}

export async function getServiceDesigns(serviceId: string): Promise<ServiceDesign[]> {
  const { data, error } = await supabase
    .from('service_designs')
    .select('*')
    .eq('service_id', serviceId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return (data as ServiceDesign[]) || []
}

export async function getPublishedShowcases(opts?: { limit?: number; category?: string }): Promise<Showcase[]> {
  let query = supabase
    .from('showcases')
    .select('*, showcase_images(*)')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (opts?.category && opts.category !== 'All') {
    query = query.eq('category', opts.category)
  }
  if (opts?.limit) {
    query = query.limit(opts.limit)
  }
  const { data, error } = await query
  if (error) throw error
  return (data as Showcase[]) || []
}

export async function getShowcasesByService(serviceId: string, limit = 2): Promise<Showcase[]> {
  const { data, error } = await supabase
    .from('showcases')
    .select('*, showcase_images(*)')
    .eq('is_published', true)
    .eq('service_id', serviceId)
    .order('display_order', { ascending: true })
    .limit(limit)
  if (error) throw error
  return (data as Showcase[]) || []
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Testimonial[]) || []
}

export async function getPublishedFaqs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return (data as FAQ[]) || []
}
