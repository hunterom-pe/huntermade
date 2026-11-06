/**
 * Post-build step (runs after `vite build` + the SSR build, see package.json).
 *
 * 1. Pre-renders the React page into dist/index.html (crawlable without JS).
 * 2. Injects SEO tags: Open Graph/Twitter, canonical, JSON-LD, preloads.
 * 3. Writes dist/__forms.html — the static Netlify Forms skeleton, generated
 *    from the same field list the React form submits (src/lib/form.ts).
 * 4. Writes robots.txt and sitemap.xml.
 *
 * Site URL (for canonical / og:url / sitemap), first match wins:
 *   SITE_URL env var  →  Netlify's URL env var (primary production URL)  →  none.
 * With no URL, canonical/og:url/sitemap URLs are omitted rather than guessed.
 */
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const { render, formMeta, site } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)

const rawUrl = (process.env.SITE_URL || process.env.URL || '').trim()
const siteUrl = rawUrl ? rawUrl.replace(/\/+$/, '') : ''
const abs = (p) => (siteUrl ? siteUrl + p : p)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const TITLE = 'Phoenix Web Design & App Development | Hunter Made'
const DESCRIPTION =
  "Hunter Made is an independent Phoenix creative studio building distinctive websites, redesigns, and custom applications for small businesses. Let's make something good."

// ---- 1. Pre-render ---------------------------------------------------------
const indexPath = join(dist, 'index.html')
let html = readFileSync(indexPath, 'utf8')
const appHtml = render()
if (!html.includes('<!--app-->')) throw new Error('index.html is missing the <!--app--> marker')
html = html.replace('<!--app-->', appHtml)

// ---- 2. Head tags ----------------------------------------------------------
const assets = readdirSync(join(dist, 'assets'))
const font = (prefix) => assets.find((f) => f.startsWith(prefix) && f.endsWith('.woff2'))
// Display face (LCP wordmark) + body face. Measured: dropping Inter's preload made FCP worse.
const preloadFonts = [font('anton-latin-400-normal'), font('inter-latin-wght-normal')]
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)

// LCP: preload the hero Moon using the same srcset/sizes the <picture> uses
const heroSource = appHtml.match(/<source type="image\/webp" srcSet="([^"]+)" sizes="([^"]+)"/i)
const preloadHero = heroSource
  ? [`<link rel="preload" as="image" type="image/webp" imagesrcset="${heroSource[1]}" imagesizes="${heroSource[2]}" fetchpriority="high" />`]
  : []

const ogImage = abs('/og-image.jpg')
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  description: DESCRIPTION,
  slogan: site.tagline,
  ...(siteUrl && { url: siteUrl + '/', image: ogImage }),
  founder: { '@type': 'Person', name: site.founder },
  address: { '@type': 'PostalAddress', addressLocality: site.location.city, addressRegion: site.location.regionShort, addressCountry: 'US' },
  areaServed: ['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler'].map((name) => ({ '@type': 'City', name: `${name}, AZ` })),
  knowsAbout: ['Web design', 'Website development', 'Website redesign', 'iOS app development'],
  sameAs: [site.links.github, site.links.instagram].filter(Boolean),
}

const gsc = process.env.GOOGLE_SITE_VERIFICATION
const head = [
  ...preloadFonts,
  ...preloadHero,
  siteUrl && `<link rel="canonical" href="${siteUrl}/" />`,
  gsc && `<meta name="google-site-verification" content="${esc(gsc)}" />`,
  `<meta property="og:type" content="website" />`,
  `<meta property="og:site_name" content="Hunter Made" />`,
  `<meta property="og:locale" content="en_US" />`,
  `<meta property="og:title" content="${esc(TITLE)}" />`,
  `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
  siteUrl && `<meta property="og:url" content="${siteUrl}/" />`,
  `<meta property="og:image" content="${ogImage}" />`,
  `<meta property="og:image:width" content="1200" />`,
  `<meta property="og:image:height" content="630" />`,
  `<meta property="og:image:alt" content="Hunter Made — The internet could use a little more personality. Black-and-white Moon with orange squares." />`,
  `<meta name="twitter:card" content="summary_large_image" />`,
  `<meta name="twitter:title" content="${esc(TITLE)}" />`,
  `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
  `<meta name="twitter:image" content="${ogImage}" />`,
  `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
]
  .filter(Boolean)
  .map((t) => '    ' + t)
  .join('\n')

// Inline the (small) stylesheets into the homepage: removes render-blocking
// requests, which dominate first paint on mobile networks.
let inlinedCss = 0
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g, (_, href) => {
  const css = readFileSync(join(dist, href), 'utf8')
  inlinedCss += css.length
  return `<style>${css}</style>`
})

const HEAD_MARKER = /<!-- @head:[^>]*-->/
if (!HEAD_MARKER.test(html)) throw new Error('index.html is missing the <!-- @head --> marker')
html = html.replace(HEAD_MARKER, head.trimStart())
writeFileSync(indexPath, html)

// ---- 3. Netlify form skeleton ---------------------------------------------
// Netlify scans deployed HTML for forms with the `data-netlify` attribute.
// This page is never linked; the React form POSTs to it (see FORM_ENDPOINT).
const inputs = formMeta.fields
  .map((f) => (f === 'message' ? `    <textarea name="message"></textarea>` : `    <input type="text" name="${f}" />`))
  .join('\n')
writeFileSync(
  join(dist, '__forms.html'),
  `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="robots" content="noindex" /><title>Form skeleton</title></head>
<body>
  <!-- Netlify Forms detection skeleton — generated by scripts/postbuild.mjs. Do not edit. -->
  <form name="${formMeta.name}" data-netlify="true" netlify-honeypot="${formMeta.honeypot}" hidden>
${inputs}
  </form>
</body>
</html>
`,
)

// ---- 4. robots.txt + sitemap.xml ------------------------------------------
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /__forms.html\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
)
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = ['/', '/privacy/']
    .map((p) => `  <url><loc>${siteUrl}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')
  writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
}

// Canonical + og:url for the privacy page, when a URL is known
const privacyPath = join(dist, 'privacy', 'index.html')
if (existsSync(privacyPath) && siteUrl) {
  const p = readFileSync(privacyPath, 'utf8').replace(
    '</title>',
    `</title>\n    <link rel="canonical" href="${siteUrl}/privacy/" />`,
  )
  writeFileSync(privacyPath, p)
}

rmSync(ssrDir, { recursive: true, force: true })

console.log(
  `postbuild: pre-rendered ${(appHtml.length / 1024).toFixed(0)} KB · inlined ${(inlinedCss / 1024).toFixed(0)} KB CSS · form "${formMeta.name}" (${formMeta.fields.length} fields) · ` +
    (siteUrl ? `site URL ${siteUrl}` : 'no site URL set — canonical/sitemap omitted'),
)
