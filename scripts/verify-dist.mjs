/**
 * Checks the production build in dist/ before deploying (`npm run verify:dist`).
 * Fails loudly if anything Netlify or search engines rely on is missing.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const read = (p) => readFileSync(join(dist, p), 'utf8')
const failures = []
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`)
  if (!ok) failures.push(msg)
}

const index = read('index.html')

// Pre-rendered content (visible without JavaScript)
check(!index.includes('<!--app-->'), 'index.html is pre-rendered (no empty app marker)')
check(/<h1[^>]*>The internet could use a little more personality\.<\/h1>/.test(index), 'H1 headline is in the static HTML')
for (const id of ['top', 'services', 'work', 'about', 'process', 'contact'])
  check(index.includes(`id="${id}"`), `section #${id} present`)
for (const name of ['Precision QA Consulting', 'asl // missed connections', 'Spec // Cocktail Sommelier', 'Roll It // Movie Picker'])
  check(index.includes(name), `project "${name}" present`)

// SEO
check(/<title>Phoenix Web Design &amp; App Development \| Hunter Made<\/title>/.test(index), 'title tag')
check(index.includes('name="description"'), 'meta description')
for (const p of ['og:title', 'og:description', 'og:image', 'twitter:card'])
  check(index.includes(`"${p}"`), `${p} meta tag`)
check(index.includes('application/ld+json'), 'JSON-LD structured data')
check(!index.includes('<!-- @head'), 'head marker replaced')
check(existsSync(join(dist, 'og-image.jpg')), 'og-image.jpg exists')
check(existsSync(join(dist, 'favicon.svg')) && existsSync(join(dist, 'apple-touch-icon.png')), 'favicons exist')
check(existsSync(join(dist, 'robots.txt')), 'robots.txt exists')
const hasUrl = index.includes('rel="canonical"')
check(hasUrl === existsSync(join(dist, 'sitemap.xml')), `canonical and sitemap agree (${hasUrl ? 'site URL set' : 'no site URL yet'})`)

// Netlify Forms
const skeleton = existsSync(join(dist, '__forms.html')) ? read('__forms.html') : ''
check(/<form name="contact" data-netlify="true" netlify-honeypot="bot-field"/.test(skeleton), '__forms.html has the Netlify form skeleton')
const skeletonFields = new Set([...skeleton.matchAll(/name="([^"]+)"/g)].map((m) => m[1]))
const formHtml = index.match(/<form[^>]*class="contact-form"[\s\S]*?<\/form>/)?.[0] ?? ''
check(!!formHtml, 'React contact form is in the static HTML')
const appFields = [...formHtml.matchAll(/\sname="([^"]+)"/g)].map((m) => m[1]).filter((n) => n !== 'contact')
const missing = appFields.filter((f) => !skeletonFields.has(f))
check(missing.length === 0, `every form field is registered with Netlify${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`)
check(!/data-netlify|netlify-honeypot/.test(index), 'main page has no netlify attributes (avoids hydration mismatch)')

// Pages
check(existsSync(join(dist, 'privacy', 'index.html')), '/privacy/ page exists')
check(existsSync(join(dist, '404.html')), '404.html exists')

// Every local asset referenced from index.html exists
const refs = [...index.matchAll(/(?:src|href|srcSet|srcset|imagesrcset)="([^"]+)"/gi)]
  .flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]))
  .filter((u) => u.startsWith('/') && !u.startsWith('//'))
const broken = [...new Set(refs)].filter((u) => !existsSync(join(dist, u.split('#')[0].split('?')[0])))
check(broken.length === 0, `all ${new Set(refs).size} local asset references resolve${broken.length ? ` (broken: ${broken.join(', ')})` : ''}`)

// External links open safely
const blanks = [...index.matchAll(/<a [^>]*target="_blank"[^>]*>/g)].map((m) => m[0])
check(blanks.every((a) => /rel="noopener noreferrer"/.test(a)), `${blanks.length} new-tab links use rel="noopener noreferrer"`)

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`)
  process.exit(1)
}
console.log('\nAll dist checks passed.')
