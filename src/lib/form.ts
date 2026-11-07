/**
 * Contact form: field names, validation and Netlify submission.
 *
 * FORM_FIELDS is the single source of truth. scripts/postbuild.mjs reads it to
 * generate dist/__forms.html, the static skeleton Netlify parses at deploy time,
 * so the names Netlify registers always match what the React form posts.
 */
import { ATTRIBUTION_FIELDS } from './attribution'

export const FORM_NAME = 'contact'
/** Honeypot field: real people never see or fill it. */
export const HONEYPOT = 'bot-field'
/** Static HTML file containing the skeleton; we POST here (a real static file, never rewritten). */
export const FORM_ENDPOINT = '/__forms.html'

export const FORM_FIELDS = {
  name: { required: true },
  email: { required: true },
  business: { required: false },
  website: { required: false },
  projectType: { required: true },
  budget: { required: false },
  message: { required: true },
} as const

export type FieldName = keyof typeof FORM_FIELDS
export type FormValues = Record<FieldName, string>
export type FormErrors = Partial<Record<FieldName, string>>

/** Every field name Netlify should know about (visible + hidden tracking + honeypot). */
export const ALL_SUBMITTED_FIELDS = [...Object.keys(FORM_FIELDS), ...ATTRIBUTION_FIELDS, HONEYPOT]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Loose: accepts "site.com", "www.site.com", "https://site.com/path"
const SITE_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i

export const MESSAGE_MIN = 10

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  const v = (k: FieldName) => values[k]?.trim() ?? ''

  if (!v('name')) errors.name = 'Please tell me your name.'
  if (!v('email')) errors.email = 'Please add your email so I can reply.'
  else if (!EMAIL_RE.test(v('email'))) errors.email = 'That email doesn’t look quite right. Please check for typos.'
  if (v('website') && !SITE_RE.test(v('website')))
    errors.website = 'Enter a web address like yourbusiness.com, or leave this blank.'
  if (!v('projectType')) errors.projectType = 'Choose the option that fits best.'
  if (!v('message')) errors.message = 'Tell me a little about your project.'
  else if (v('message').length < MESSAGE_MIN)
    errors.message = `A few more words would help (at least ${MESSAGE_MIN} characters).`

  return errors
}

/** application/x-www-form-urlencoded, as Netlify Forms expects. */
export function encode(data: Record<string, string>): string {
  return new URLSearchParams(data).toString()
}

export type SubmitResult = { ok: true } | { ok: false; reason: 'network' | 'server' }

/**
 * POST the form to Netlify. In `npm run dev` there is no Netlify, so submission
 * is simulated: add ?form=error to the URL to preview the error state.
 */
export async function submitToNetlify(data: Record<string, string>, fetchImpl: typeof fetch = fetch): Promise<SubmitResult> {
  if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    await new Promise((r) => setTimeout(r, 900))
    const fail = new URLSearchParams(window.location.search).get('form') === 'error'
    return fail ? { ok: false, reason: 'server' } : { ok: true }
  }

  try {
    const res = await fetchImpl(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': FORM_NAME, ...data }),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'server' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
