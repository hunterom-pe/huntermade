# Hunter Made: launch checklist

Status as of **6 Nov 2026**: built and verified locally, pushed to GitHub `main`. **Not yet deployed.**

Legend: ✅ done and verified locally · ⬜ to do · 🟧 needs Hunter's input or decision

---

## 1. Verified locally

| Check | Result |
| --- | --- |
| Clean install (`npm ci`) + `npm run check` (lint, tests, build, dist checks) | ✅ 0 lint warnings · 25/25 tests · 36/36 dist checks |
| `npm audit` (production deps) | ✅ 0 vulnerabilities |
| Lighthouse mobile (local prod build) | ✅ Performance 91 · Accessibility 100 · Best practices 100 · SEO 100 · CLS 0 |
| Lighthouse desktop | ✅ 100 · 100 · 100 · 100 |
| Lighthouse `/privacy/` (mobile) | ✅ 99 · 100 · 100 · 100 |
| Console errors: `/`, `/privacy/`, `/404.html` (prod) and dev | ✅ none (incl. no hydration warnings) |
| Horizontal overflow / tap targets at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560 | ✅ none / all ≥ 24px |
| External links (4 projects, 4 repos, GitHub profile, Netlify privacy) | ✅ all HTTP 200, open in a new tab with `noopener noreferrer` |
| Nav anchors, skip link, mobile menu (focus, Esc, inert) | ✅ |
| Form: required fields, email/website validation, focus on first error, sending, success, error with retry, network failure | ✅ (unit tests + real browser) |
| Form field names match the Netlify skeleton | ✅ (generated from one source and checked by `verify:dist`) |
| Reduced motion | ✅ animations and transitions disabled |
| JavaScript disabled | ✅ full content visible (pre-rendered, no hidden reveal sections) |

---

## 2. Go-live steps

1. ✅ **Push:** `main` is on `github.com/hunterom-pe/huntermade`.
2. ⬜ **Netlify:** Add new site → Import from GitHub → `huntermade`. Settings come from `netlify.toml`. Production branch: `main`.
3. ⬜ **Forms:** Site configuration → Forms → **Enable form detection**, then **trigger a new deploy**.
4. ⬜ Confirm a form called **`contact`** appears under Forms → Active forms.
5. ⬜ **Notifications:** Forms → Form notifications → Email → form `contact` → your inbox.
6. ⬜ **Live test submission:** open `https://<site>/?utm_source=test&utm_medium=manual&utm_campaign=launch-check`, submit a test inquiry, then confirm all of these:
   - ⬜ the success message appears
   - ⬜ the entry appears in Netlify Forms, with the UTM fields filled in
   - ⬜ the notification email arrives
   - ⬜ delete the test entry afterwards
7. 🟧 **Domain:** add it in Domain management and set it as primary. HTTPS is automatic. **Redeploy** afterwards so the canonical URL, `og:url` and the sitemap use it.
8. ⬜ **After the domain is live:**
   - ⬜ View source and confirm `<link rel="canonical" href="https://yourdomain/">`
   - ⬜ `https://yourdomain/sitemap.xml` and `/robots.txt` load
   - ⬜ Share-preview check: paste the URL into the Facebook Sharing Debugger and LinkedIn Post Inspector, and confirm the image and title
   - ⬜ `https://yourdomain/anything` shows the branded 404 page
   - ⬜ Re-run Lighthouse on the live URL (mobile and desktop)
   - ⬜ Phone check on a real iPhone and Android device: hero, menu, form keyboard behaviour
9. ⬜ **Google Search Console:** add a Domain property (DNS verification) → submit `sitemap.xml`.

---

## 3. Waiting on Hunter

| Item | Where | Notes |
| --- | --- | --- |
| 🟧 Production domain | Netlify | Nothing is invented; canonical and sitemap appear automatically once it's set. |
| ✅ Portrait photo | `public/images/hunter-portrait.jpg` | Added Nov 2026 (photo with your cat), shown in black and white. |
| ✅ Calendly URL | `links.calendly` in `src/data/site.ts` | Set to calendly.com/hunterom8-proton. Shown in Contact and after a submission. |
| 🟧 Instagram URL (optional) | `links.instagram` in `src/data/site.ts` | Adds it to the footer. |
| 🟧 Privacy policy review | `privacy/index.html` | A plain-language draft, not legal advice. It names *Precision QA Consulting LLC* as the operator; please confirm that wording. |
| ✅ Analytics | `site.analytics` in `src/data/site.ts` | Umami Cloud, cookieless, counts huntermade.studio only. The Meta Pixel still needs a consent UI and a privacy update before `VITE_META_PIXEL_ID` does anything. |
| 🟧 Notification inbox | Netlify Forms | Which email should receive inquiries. |

---

## 4. Known trade-offs and notes

- **Mobile LCP is 3.4s** on Lighthouse's simulated slow 4G: the big wordmark waits for the Anton font, about 19 KB and preloaded. Showing a fallback font first would make it faster but undercut the brand on first view. Expect better numbers on Netlify's CDN with compression; re-measure live.
- **The hero buttons are below the fold on phones.** The header's "Start a project" button is visible at every width, and the phone layout prioritises the wordmark, headline and Moon.
- **Netlify Forms can only be verified after deployment.** Locally (`npm run dev`) the form simulates success, and `?form=error` previews the error state.
- **precisionqaconsulting.com:** at 390px wide, its header's "Book a Consult" button is cut off at the right edge. That belongs to the other repo, but it's worth fixing since this site links to it.
- **No Content-Security-Policy header yet.** Inline JSON-LD, the inline CSS and optional analytics need allowances, so add a CSP once the analytics decision is made.
