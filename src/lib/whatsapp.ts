export function buildWhatsAppLink(digits: string | null | undefined, message: string): string {
  const num = digits || import.meta.env.VITE_WHATSAPP_FALLBACK || ''
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}
