import { useSettings } from '../contexts/SettingsContext'
import { buildWhatsAppLink } from '../lib/whatsapp'

export default function WhatsAppFloat() {
  const { settings } = useSettings()
  return (
    <a
      href={buildWhatsAppLink(settings.whatsapp_digits, 'Hello, I would like to know more about your saree services.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-card text-white"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor">
        <path d="M16.02 3C9.4 3 4 8.38 4 15c0 2.35.66 4.55 1.8 6.43L4 29l7.75-1.72A11.94 11.94 0 0016.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.7c-1.94 0-3.76-.53-5.32-1.46l-.38-.22-4.6 1.02 1-4.48-.25-.4A9.63 9.63 0 016.32 15c0-5.36 4.36-9.7 9.7-9.7 5.35 0 9.7 4.34 9.7 9.7 0 5.36-4.35 9.7-9.7 9.7zm5.32-7.26c-.29-.15-1.72-.85-1.98-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.35-1.45-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.08-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.19 3.02c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34z" />
      </svg>
    </a>
  )
}
