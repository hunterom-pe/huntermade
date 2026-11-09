/**
 * Analytics: Umami Cloud (cookieless, no personal data).
 *
 * Configured in src/data/site.ts → analytics.umamiWebsiteId. Set it to null to
 * turn analytics off. The website ID is public (it appears in every page), so it
 * lives in the code rather than in a secret.
 *
 * `data-domains` restricts tracking to the production domain, so local
 * development, `npm run preview` and Netlify preview deploys are never counted.
 *
 * Components call track() for meaningful events only (e.g. a successful form
 * submission). Umami records UTM campaign parameters automatically.
 *
 * Meta Pixel stays separate and disabled (see lib/metaPixel.ts).
 */
import { site } from '../data/site'
import { loadMetaPixel, trackMetaPixel } from './metaPixel'

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Props) => void }
  }
}

export const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function initAnalytics(
  config: { websiteId?: string | null; domains?: string } = {
    websiteId: site.analytics.umamiWebsiteId,
    domains: site.analytics.trackedDomains,
  },
): void {
  if (typeof window === 'undefined') return

  const id = config.websiteId?.trim()
  if (id && UUID_RE.test(id) && !document.querySelector(`script[src="${UMAMI_SCRIPT}"]`)) {
    const s = document.createElement('script')
    s.defer = true
    s.src = UMAMI_SCRIPT
    s.dataset.websiteId = id
    if (config.domains) s.dataset.domains = config.domains
    document.head.appendChild(s)
  }

  loadMetaPixel()
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === 'undefined') return
  try {
    window.umami?.track(event, props)
  } catch {
    /* analytics must never break the page */
  }
  trackMetaPixel(event, props)
}
