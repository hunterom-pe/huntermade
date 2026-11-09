# Hunter Made

The portfolio and lead-generation site for **Hunter Made**, Hunter Ortega-Mathews' independent web and app development studio in Phoenix, AZ.

> The internet could use a little more personality.

React 19 + Vite + TypeScript, hand-written CSS (no UI framework), hosted on Netlify. The page is pre-rendered to static HTML at build time, so content and the contact form work for crawlers and are visible without JavaScript.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. The contact form **simulates** submission here (add `?form=error` to the URL to preview the error state). |
| `npm run build` | Type-check → client build → pre-render → SEO tags, form skeleton, robots/sitemap (`scripts/postbuild.mjs`). Output: `dist/` |
| `npm run preview` | Serve `dist/` locally (http://localhost:4173) |
| `npm test` | Unit + component tests (Vitest, jsdom) |
| `npm run lint` | oxlint |
| `npm run verify:dist` | Checks the built site: pre-rendered content, meta tags, Netlify form skeleton matches the form, assets resolve, safe external links |
| `npm run check` | All of the above, in order. Run before every deploy. |

Node 22+ (Netlify uses 22, see `netlify.toml`).

---

## Project structure

```
index.html                 Page shell (head tags injected at build)
privacy/index.html         Privacy policy (static page)
404.html                   Not-found page
netlify.toml               Build, headers, caching
scripts/
  postbuild.mjs            Pre-render + SEO + form skeleton + robots/sitemap
  verify-dist.mjs          Build output checks
src/
  data/
    site.ts                ← name, location, links (GitHub/Instagram/Calendly), portrait, CTAs
    content.ts             ← all section copy (services, about, process, contact…)
    projects.ts            ← portfolio projects, links and screenshots
  components/              One folder per section (component + CSS)
  lib/
    form.ts                Form fields, validation, Netlify submission
    attribution.ts         UTM capture for form submissions
    analytics.ts           Optional analytics (off by default)
    metaPixel.ts           Optional Meta Pixel (off + consent-gated)
  styles/
    tokens.css             ← colours, type scale, spacing, motion (design system)
    base.css, motion.css   Reset, buttons, utilities, animation foundation
  assets/                  Optimised images (hashed at build)
public/                    Copied as-is: favicons, og-image.jpg
CREDITS.md                 Image and font sources and licences
```

---

## Updating content

- **Copy:** edit `src/data/content.ts`. The hero lives in `src/components/Hero/Hero.tsx`.
- **Links, location, CTAs:** `src/data/site.ts`.
- **Portfolio:** `src/data/projects.ts`. The Selected Work layout expects 4 projects in this order: business site (big browser feature), expressive app (fan of 3 phones), then two apps (2 phones each). To change a project, edit its text and links and swap its screenshots.
- **Colours / fonts / spacing:** `src/styles/tokens.css`. Contrast notes are in that file. Never put cream or orange *text* on orange.

### Replacing images

1. Put the source file anywhere, then export WebP versions at the sizes used:
   - phone screenshots: 400 and 640px wide (`src/assets/work/<app>-<n>-400.webp`, `-640.webp`)
   - website screenshots: 800 and 1400px wide
2. Update the imports at the top of `src/data/projects.ts`, and write a specific `alt` text.
3. Record the source in `CREDITS.md`.

### Replacing the portrait

1. Add your photo as `public/images/hunter-portrait.jpg`: 4:5 ratio, about 1000×1250px, under 250 KB.
2. In `src/data/site.ts`, set `portrait: '/images/hunter-portrait.jpg'`.

The photo is automatically shown in black and white with the orange blocks, and the designed placeholder disappears.

### Adding Calendly or Instagram

In `src/data/site.ts` → `links`:

```ts
calendly: 'https://calendly.com/your-handle/intro',   // shows "Prefer to talk? Book a call" in Contact + after a submission
instagram: 'https://instagram.com/your-handle',       // shows in the footer
```

Leave them `null` to hide them.

---

## Deploying to Netlify

### 1. Connect the repository
1. Netlify → **Add new site → Import an existing project → GitHub** → choose `hunterom-pe/huntermade`.
2. Build settings are read from `netlify.toml` (command `npm run build`, publish `dist`). Leave the UI fields as detected.
3. **Production branch:** `main` (Site configuration → Build & deploy → Branches and deploy contexts).
4. Deploy.

### 2. Enable Forms
1. Site configuration → **Forms** → **Enable form detection**.
2. Trigger a new deploy (Deploys → Trigger deploy → Deploy site). Detection only runs on deploys made *after* it's enabled.
3. Check **Forms → Active forms**. A form named **`contact`** should be listed.

**How it works:** Netlify can't see forms that React renders, so the build writes `dist/__forms.html`, a hidden static copy of the form that Netlify detects. It's generated from the same field list the React form submits (`src/lib/form.ts`), so the two can't drift apart. The React form then POSTs url-encoded data, including `form-name=contact`, to `/__forms.html`. `bot-field` is a honeypot, and Netlify's spam filtering also applies.

Fields received: `name, email, business, website, projectType, budget, message`, plus campaign data `utm_source, utm_medium, utm_campaign, utm_term, utm_content, landing_page, referrer`. These are empty when the visitor didn't come from a tagged link.

### 3. Email notifications
Site configuration → Forms → **Form notifications** → Add notification → **Email notification** → form `contact` → your email address.

### 4. Test a real submission (required after deploying)
Local tests can't prove that Netlify receives submissions. After deploying:
1. Open the live site **with tags**, e.g. `https://<your-site>/?utm_source=test&utm_medium=manual&utm_campaign=launch-check`.
2. Submit the form with real-looking values and the message "Launch test".
3. Confirm all of the following:
   - the success message appears;
   - the entry appears in Netlify → Forms → contact, with the UTM fields filled in;
   - the notification email arrives.
4. Delete the test entry in Netlify.

If the entry lands in **Spam**, mark it as verified.

### 5. Connect a domain
1. Domain management → **Add a domain** and follow the DNS steps. Netlify provisions HTTPS automatically.
2. Set it as the **primary domain**.
3. Redeploy. The build reads Netlify's `URL` variable (the primary domain) to create `canonical`, `og:url`, absolute `og:image` URLs, `sitemap.xml` and the sitemap line in `robots.txt`.
   - To force a specific address, set the environment variable `SITE_URL=https://yourdomain.com`.
   - With no URL at all, those tags are omitted rather than guessed.

---

## SEO

- Title, description, Open Graph/Twitter tags and the social image (`public/og-image.jpg`, 1200×630) are set at build time in `scripts/postbuild.mjs`.
- JSON-LD `ProfessionalService` uses only verified facts: name, founder, Phoenix, AZ, areas served, and GitHub. Add a phone number or email there only if you want them public.
- **Google Search Console:** the easiest option is the Domain property with DNS verification, which needs no code. Alternatively, set the env var `GOOGLE_SITE_VERIFICATION=<token>`, which adds the meta tag, then redeploy. Afterwards, submit `https://yourdomain.com/sitemap.xml`.

---

## Analytics and ads

**Umami Cloud** is on: it's cookieless, collects no personal data, and needs no consent banner.

- **Config:** `site.analytics` in `src/data/site.ts` holds the public website ID. Set `umamiWebsiteId: null` to turn analytics off.
- **Only the live site is counted:** `trackedDomains: 'huntermade.studio'` becomes Umami's `data-domains`, so local dev, `npm run preview` and Netlify preview deploys are ignored.
- **Events:** successful contact-form submissions send a `contact_submitted` event with the project type. It appears under Events in Umami automatically.
- **Campaigns:** Umami records UTM parameters on its own, so tag ad links like `?utm_source=instagram&utm_medium=paid_social&utm_campaign=<name>`.

| Variable | Effect |
| --- | --- |
| `VITE_META_PIXEL_ID=…` | Prepares the Meta Pixel, but it **still won't load** until the visitor consents: call `grantMarketingConsent()` from `src/lib/metaPixel.ts`. You must add a consent UI and update the privacy policy first. It sends a `Lead` event only, never the form contents. |

## Quality notes

- **Accessibility:** semantic landmarks, one `h1`, labelled fields with inline error messages (`aria-invalid` and `aria-describedby`), focus moves to the first error, success and error messages are announced, a skip link, visible focus rings (including on dark panels), a keyboard-accessible mobile menu (Esc closes it and the page behind becomes inert), and 44px+ touch targets.
- **Motion:** CSS only. `prefers-reduced-motion` turns it all off.
- **Without JavaScript:** all content is pre-rendered and visible. Scroll-reveal hiding only applies once JS is running, with a 4s safety net.
- **Performance:** self-hosted fonts (latin subsets, the main two preloaded), the homepage CSS inlined at build, the hero image preloaded with responsive `srcset`, everything else lazy-loaded, and hashed assets cached for a year.
- **Measured (Lighthouse 12, local production build, 6 Nov 2026):** mobile 91 performance / 100 accessibility / 100 best practices / 100 SEO; desktop 100 / 100 / 100 / 100; CLS 0. Mobile LCP (3.4s simulated slow 4G) is the wordmark waiting for the Anton font. Re-measure on the live site, since Netlify adds compression and a CDN.

See **LAUNCH.md** for the go-live checklist.
