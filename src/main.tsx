import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

// Self-hosted fonts (SIL Open Font License) — latin subsets only
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/inter'
import '@fontsource/space-mono/latin-400.css'
import '@fontsource/space-mono/latin-700.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'

import App from './App.tsx'
import { captureAttribution } from './lib/attribution'
import { initAnalytics } from './lib/analytics'

captureAttribution()
initAnalytics()

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is pre-rendered at build time (scripts/postbuild.mjs) → hydrate it.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)

// Tell the no-JS safety net in index.html that the app is alive
;(window as Window & { __hmReady?: boolean }).__hmReady = true
