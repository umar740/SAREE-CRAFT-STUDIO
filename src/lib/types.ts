export type RequestStatus =
  | 'new'
  | 'contacted'
  | 'quotation_sent'
  | 'approved'
  | 'saree_received'
  | 'in_progress'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus =
  | 'not_paid'
  | 'advance_paid'
  | 'partially_paid'
  | 'fully_paid'
  | 'refunded'

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  what_can_do: string[]
  starting_price: number | null
  estimated_duration: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ServiceDesign {
  id: string
  service_id: string
  name: string
  description: string
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Showcase {
  id: string
  service_id: string | null
  title: string
  category: string
  description: string
  starting_price: number | null
  duration: string | null
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
  showcase_images?: ShowcaseImage[]
}

export interface ShowcaseImage {
  id: string
  showcase_id: string
  image_type: 'before' | 'after' | 'additional'
  image_url: string
  display_order: number
  created_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  whatsapp: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface ServiceRequest {
  id: string
  request_number: string
  customer_id: string | null
  service_id: string | null
  design_id: string | null
  description: string
  preferred_date: string | null
  budget: number | null
  status: RequestStatus
  quoted_price: number | null
  advance_amount: number | null
  remaining_amount: number | null
  payment_status: PaymentStatus
  admin_notes: string | null
  marketing_consent: boolean
  created_at: string
  updated_at: string
  customers?: Customer
  services?: Service
  service_designs?: ServiceDesign
  request_images?: RequestImage[]
}

export interface RequestImage {
  id: string
  request_id: string
  image_url: string
  created_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  review: string
  rating: number
  image_url: string | null
  is_published: boolean
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  is_published: boolean
  created_at: string
}

export interface SiteSettings {
  id: number
  business_name: string
  phone: string | null
  whatsapp: string | null
  whatsapp_digits: string | null
  email: string | null
  address: string | null
  maps_url: string | null
  business_hours: string | null
  instagram_url: string | null
  facebook_url: string | null
  logo_url: string | null
  hero_image_url: string | null
  homepage_text: string | null
  footer_text: string | null
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string | null
  name: string | null
  role: 'admin' | 'staff'
  created_at: string
}
