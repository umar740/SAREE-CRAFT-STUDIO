import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteSettings } from '../lib/types'

const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  business_name: '[BUSINESS NAME]',
  phone: '[PHONE NUMBER]',
  whatsapp: '[WHATSAPP NUMBER]',
  whatsapp_digits: import.meta.env.VITE_WHATSAPP_FALLBACK || '910000000000',
  email: '[EMAIL]',
  address: '[BUSINESS ADDRESS]',
  maps_url: '#',
  business_hours: '[BUSINESS HOURS]',
  instagram_url: '[INSTAGRAM URL]',
  facebook_url: '[FACEBOOK URL]',
  logo_url: null,
  hero_image_url: null,
  homepage_text: null,
  footer_text: null,
  updated_at: new Date().toISOString(),
}

interface SettingsContextValue {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: FALLBACK_SETTINGS,
  loading: true,
  refresh: async () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS)
  const [loading, setLoading] = useState(true)

  async function fetchSettings() {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    if (!error && data) {
      setSettings(data as SiteSettings)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
