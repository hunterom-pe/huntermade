import { contact } from '../../data/content'
import { site } from '../../data/site'
import { SectionHead } from '../SectionHead/SectionHead'
import { ContactForm } from './ContactForm'
import './Contact.css'

/**
 * Contact section.
 * Layout + intro copy. The form itself lives in ContactForm.tsx and submits
 * to Netlify Forms (see lib/form.ts and README → Forms).
 */
export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact__layout">
        <div className="contact__head">
          <SectionHead index="05" label="Contact" titleId="contact-title" title={contact.title} tone="onOrange" />
        </div>

          <div className="contact__intro" data-reveal>
            {contact.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}

            {site.links.calendly && (
              <a className="contact__consult" href={site.links.calendly} target="_blank" rel="noopener noreferrer">
                <span className="label">Prefer to talk? Book a call</span>
                <span aria-hidden="true">↗</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}

            <p className="contact__where label">
              <span className="contact__square" aria-hidden="true" />
              {site.location.city}, {site.location.region} — working with businesses across the Valley and beyond
            </p>
          </div>

          <ContactForm />
      </div>
    </section>
  )
}
