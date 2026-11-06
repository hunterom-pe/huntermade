/**
 * Analytics — provider-agnostic and OFF by default.
 *
 * Nothing is loaded and nothing is sent unless you configure a provider with
 * build-time env vars (Netlify → Site configuration → Environment variables):
 *
 *   VITE_PLAUSIBLE_DOMAIN=yourdomain.com   → loads Plausible (cookieless, privacy-friendly)
 *   VITE_META_PIXEL_ID=1234567890          → see lib/metaPixel.ts (also requires consent)
 *
 * Components call track() for meaningful events only (e.g. a form submission).
 */
import { loadMetaPixel, trackMetaPixel } from './metaPixel'

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: ((event: string, opts?: { props?: Props }) => void) & { q?: unknown[] }
  }
}

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

export function initAnalytics(): void {
  if (typeof window === 'undefined') return
  if (PLAUSIBLE_DOMAIN && !document.querySelector('script[data-domain]')) {
    window.plausible =
      window.plausible ||
      Object.assign((...args: unknown[]) => (window.plausible!.q = window.plausible!.q || []).push(args), { q: [] })
    const s = document.createElement('script')
    s.defer = true
    s.dataset.domain = PLAUSIBLE_DOMAIN
    s.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(s)
  }
  loadMetaPixel()
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === 'undefined') return
  window.plausible?.(event, { props })
  trackMetaPixel(event, props)
}
