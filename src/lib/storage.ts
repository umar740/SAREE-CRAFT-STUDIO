import { supabase } from './supabase'

/**
 * Uploads a file to a Supabase Storage bucket and returns its public URL
 * (for public buckets) or storage path (for private buckets like
 * customer-uploads, which must be read back with a signed URL by an admin).
 */
export async function uploadToBucket(bucket: string, file: File, folder = ''): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  if (bucket === 'customer-uploads') {
    // Private bucket — store the path; admin views it via a signed URL.
    return path
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  if (error) return null
  return data.signedUrl
}

export async function deleteFromBucket(bucket: string, path: string) {
  // path must be the storage path, not the full public URL
  await supabase.storage.from(bucket).remove([path])
}

/** Extract the storage path from a Supabase public URL for a given bucket. */
export function pathFromPublicUrl(bucket: string, url: string): string | null {
  const marker = `/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}
