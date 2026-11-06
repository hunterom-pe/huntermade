/**
 * Campaign attribution (UTM parameters) for contact-form submissions.
 *
 * - Captures utm_* from the first landing URL of a visit and keeps them in
 *   sessionStorage (cleared when the tab closes). No cookies, no fingerprinting.
 * - Records only the landing *path* (no query string) and the referring *domain*.
 * - Values travel only with a form the visitor chooses to submit.
 */

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
export const ATTRIBUTION_FIELDS = [...UTM_KEYS, 'landing_page', 'referrer'] as const
export type Attribution = Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>>

const STORAGE_KEY = 'hm_attribution'
const MAX_LEN = 150

// Strip control characters and angle brackets (intentional control-char range)
// oxlint-disable-next-line no-control-regex
const clean = (s: string) => s.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, MAX_LEN)

export function parseAttribution(href: string, referrer: string): Attribution {
  const url = new URL(href)
  const out: Attribution = {}
  for (const key of UTM_KEYS) {
    const v = url.searchParams.get(key)
    if (v) out[key] = clean(v)
  }
  out.landing_page = clean(url.pathname)
  if (referrer) {
    try {
      const ref = new URL(referrer)
      if (ref.hostname && ref.hostname !== url.hostname) out.referrer = clean(ref.hostname)
    } catch {
      /* ignore malformed referrers */
    }
  }
  return out
}

/** Call once on page load. First touch wins within a browser session. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parseAttribution(location.href, document.referrer)))
  } catch {
    /* storage unavailable (private mode etc.) — attribution is optional */
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Attribution
  } catch {
    /* fall through */
  }
  try {
    return parseAttribution(location.href, document.referrer)
  } catch {
    return {}
  }
}
