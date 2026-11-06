/**
 * Meta (Facebook/Instagram) Pixel — DISABLED by default.
 *
 * It only loads when BOTH are true:
 *   1. VITE_META_PIXEL_ID is set at build time, and
 *   2. the visitor has given consent: call grantMarketingConsent() from a
 *      consent UI you add (not included — add one before enabling the pixel).
 *
 * Before enabling: update the privacy policy, decide on a consent approach
 * suitable for your audience, and avoid sending form contents to Meta.
 */
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined
const CONSENT_KEY = 'hm_marketing_consent'

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown }
declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

const hasConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted'
  } catch {
    return false
  }
}

export function grantMarketingConsent(): void {
  try {
    localStorage.setItem(CONSENT_KEY, 'granted')
  } catch {
    /* ignore */
  }
  loadMetaPixel()
}

export function loadMetaPixel(): void {
  if (!PIXEL_ID || !hasConsent() || window.fbq) return
  const fbq: Fbq = (...args: unknown[]) => {
    fbq.queue!.push(args)
  }
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  window.fbq = window._fbq = fbq
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)
  fbq('init', PIXEL_ID)
  fbq('track', 'PageView')
}

/** Maps our events to Meta standard events. Sends no form field contents. */
export function trackMetaPixel(event: string, _props: Record<string, unknown>): void {
  if (!window.fbq) return
  if (event === 'contact_submitted') window.fbq('track', 'Lead')
}
