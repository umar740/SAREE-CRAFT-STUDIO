export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'Price on inspection'
  return `₹${price.toLocaleString('en-IN')}`
}

export function formatStartingPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'Price on inspection'
  return `Starting from ₹${price.toLocaleString('en-IN')}`
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB

export function validateImageFile(file: File): string | null {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image type. Use JPG, PNG or WebP.`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" is larger than 8MB.`
  }
  return null
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  quotation_sent: 'Quotation Sent',
  approved: 'Approved',
  saree_received: 'Saree Received',
  in_progress: 'Work in Progress',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const PAYMENT_LABELS: Record<string, string> = {
  not_paid: 'Not Paid',
  advance_paid: 'Advance Paid',
  partially_paid: 'Partially Paid',
  fully_paid: 'Fully Paid',
  refunded: 'Refunded',
}

export function statusBadgeClasses(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-amber-100 text-amber-800'
    case 'contacted':
    case 'quotation_sent':
      return 'bg-indigo-100 text-indigo-700'
    case 'approved':
    case 'saree_received':
    case 'in_progress':
      return 'bg-violet-100 text-violet-700'
    case 'ready':
      return 'bg-teallight text-teal'
    case 'delivered':
      return 'bg-green-100 text-green-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function paymentBadgeClasses(status: string): string {
  switch (status) {
    case 'fully_paid':
      return 'bg-green-100 text-green-700'
    case 'advance_paid':
    case 'partially_paid':
      return 'bg-amber-100 text-amber-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-red-100 text-red-700'
  }
}
