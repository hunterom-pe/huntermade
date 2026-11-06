/**
 * Build-time pre-render entry (used by scripts/postbuild.mjs, never shipped).
 * Renders the page to static HTML so content is crawlable without JS and
 * exports form metadata so the Netlify form skeleton always matches the app.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { site } from './data/site'
import { ALL_SUBMITTED_FIELDS, FORM_NAME, HONEYPOT } from './lib/form'

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export const formMeta = { name: FORM_NAME, honeypot: HONEYPOT, fields: ALL_SUBMITTED_FIELDS }
export { site }
