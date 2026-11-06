import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode } from 'react'
import { contact } from '../../data/content'
import { site } from '../../data/site'
import { getAttribution } from '../../lib/attribution'
import { track } from '../../lib/analytics'
import {
  FORM_FIELDS,
  FORM_NAME,
  HONEYPOT,
  submitToNetlify,
  validate,
  type FieldName,
  type FormErrors,
  type FormValues,
} from '../../lib/form'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: FormValues = Object.fromEntries(Object.keys(FORM_FIELDS).map((k) => [k, ''])) as FormValues
const ORDER = Object.keys(FORM_FIELDS) as FieldName[]

type FieldProps = {
  name: FieldName
  label: string
  error?: string
  hint?: string
  children: (aria: {
    id: string
    name: FieldName
    'aria-invalid': boolean
    'aria-describedby'?: string
    'aria-required'?: boolean
  }) => ReactNode
}

/** Label + control + hint/error wiring for one field. */
function Field({ name, label, error, hint, children }: FieldProps) {
  const id = `f-${name}`
  const required = FORM_FIELDS[name].required
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="field__req" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="field__opt"> (optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {children({ id, name, 'aria-invalid': !!error, 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {error && (
        <p id={`${id}-error`} className="field__error">
          <span aria-hidden="true">■ </span>
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'error') errorRef.current?.focus()
  }, [status])

  const visibleError = (k: FieldName) => (attempted || touched[k] ? errors[k] : undefined)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    // live-correct errors once the visitor has seen them
    if (attempted || touched[e.target.name as FieldName]) setErrors(validate(next))
  }

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const k = e.target.name as FieldName
    if (!values[k]) return // don't scold empty fields just for tabbing through
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return
    setAttempted(true)
    const found = validate(values)
    setErrors(found)
    const firstBad = ORDER.find((k) => found[k])
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#f-${firstBad}`)?.focus()
      return
    }

    const honeypot = (formRef.current?.elements.namedItem(HONEYPOT) as HTMLInputElement | null)?.value ?? ''
    setStatus('submitting')
    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]))
    const result = await submitToNetlify({
      ...trimmed,
      ...(getAttribution() as Record<string, string>),
      [HONEYPOT]: honeypot,
    })
    if (result.ok) {
      track('contact_submitted', { projectType: values.projectType })
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form--success" role="status">
        <span className="contact-form__success-mark" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="contact-form__success-title">
          {contact.success.title}
        </h3>
        <p>{contact.success.body}</p>
        {site.links.calendly && (
          <a className="btn" href={site.links.calendly} target="_blank" rel="noopener noreferrer">
            Book a time to talk <span className="btn__arrow" aria-hidden="true">↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    )
  }

  const busy = status === 'submitting'
  const errorCount = attempted ? Object.keys(errors).length : 0

  return (
    <form
      ref={formRef}
      className="contact-form"
      name={FORM_NAME}
      method="POST"
      noValidate
      onSubmit={onSubmit}
      aria-busy={busy}
      aria-describedby="form-note"
      data-reveal
    >
      <p id="form-note" className="contact-form__note label">
        Fields marked <span aria-hidden="true">*</span>
        <span className="visually-hidden">with an asterisk</span> are required
      </p>

      {/* Honeypot — hidden from people and assistive tech; bots tend to fill it */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="f-bot">Leave this field empty</label>
        <input id="f-bot" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="visually-hidden" aria-live="polite">
        {errorCount > 0 ? `${errorCount} ${errorCount === 1 ? 'field needs' : 'fields need'} attention.` : ''}
      </p>

      <div className="field-row">
        <Field name="name" label="Name" error={visibleError('name')}>
          {(a) => <input {...a} type="text" autoComplete="name" value={values.name} onChange={onChange} onBlur={onBlur} />}
        </Field>
        <Field name="email" label="Email" error={visibleError('email')}>
          {(a) => (
            <input {...a} type="email" autoComplete="email" inputMode="email" value={values.email} onChange={onChange} onBlur={onBlur} />
          )}
        </Field>
      </div>

      <div className="field-row">
        <Field name="business" label="Business name" error={visibleError('business')}>
          {(a) => <input {...a} type="text" autoComplete="organization" value={values.business} onChange={onChange} onBlur={onBlur} />}
        </Field>
        <Field name="website" label="Existing website" error={visibleError('website')}>
          {(a) => (
            <input
              {...a}
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
              value={values.website}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </Field>
      </div>

      <div className="field-row">
        <Field name="projectType" label="Project type" error={visibleError('projectType')}>
          {(a) => (
            <select {...a} value={values.projectType} onChange={onChange} onBlur={onBlur}>
              <option value="" disabled>
                Choose one
              </option>
              {contact.projectTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
        </Field>
        <Field name="budget" label="Estimated budget" error={visibleError('budget')}>
          {(a) => (
            <select {...a} value={values.budget} onChange={onChange} onBlur={onBlur}>
              <option value="">Prefer not to say</option>
              {contact.budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field name="message" label="Tell me about your project" error={visibleError('message')}>
        {(a) => <textarea {...a} rows={5} value={values.message} onChange={onChange} onBlur={onBlur} />}
      </Field>

      {status === 'error' && (
        <div ref={errorRef} tabIndex={-1} className="contact-form__alert" role="alert">
          <strong>That didn’t go through.</strong> Your message is still here. Please check your connection and try
          again in a moment.
        </div>
      )}

      <button className="btn contact-form__submit" type="submit" aria-disabled={busy}>
        {busy ? (
          <>
            <span className="contact-form__spinner" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            {status === 'error' ? 'Try again' : 'Send message'} <span className="btn__arrow" aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  )
}
