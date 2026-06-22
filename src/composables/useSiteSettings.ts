import { ref } from 'vue'
import axios from '../plugins/axios'

// Shared, app-wide cache of the public settings the website reads (contact,
// social, footer, general). Edited in the CMS Settings page; exposed to the
// public site via GET /api/settings/public.
const settings = ref<Record<string, string>>({})
const loaded = ref(false)
let inflight: Promise<void> | null = null

export function useSiteSettings() {
  // Load public settings once (cached). Pass force=true to refetch.
  const load = async (force = false): Promise<void> => {
    if (loaded.value && !force) return
    if (inflight) return inflight
    inflight = (async () => {
      try {
        const res = await axios.get('/api/settings/public')
        const data = (res.data as any)?.settings || {}
        settings.value = data && typeof data === 'object' ? data : {}
        loaded.value = true
      } catch {
        // Network/endpoint error — keep whatever we have; callers use fallbacks.
      } finally {
        inflight = null
      }
    })()
    return inflight
  }

  // Get a setting value, falling back to a sensible default when unset.
  const get = (key: string, fallback = ''): string => {
    const v = settings.value[key]
    return v === undefined || v === null || v === '' ? fallback : String(v)
  }

  return { settings, loaded, load, get }
}
