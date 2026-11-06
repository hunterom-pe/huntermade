/**
 * Site-wide content & configuration.
 * Edit copy, links and contact details here — components read from this file.
 */

export const site = {
  name: 'Hunter Made',
  founder: 'Hunter Ortega-Mathews',
  tagline: 'The internet could use a little more personality.',
  location: {
    city: 'Phoenix',
    region: 'Arizona',
    regionShort: 'AZ',
    // Downtown Phoenix — used only as an editorial detail
    coordinates: '33.4484° N, 112.0740° W',
  },

  /**
   * Production URL. Leave null until the domain is connected —
   * canonical / OG URLs are only emitted once this is set.
   */
  url: null as string | null,

  /**
   * Portrait photo. Leave null to show the designed placeholder.
   * To add the real photo: put it in /public/images/ (e.g. hunter-portrait.jpg,
   * 4:5 ratio, ~1000x1250) and set: portrait: '/images/hunter-portrait.jpg'
   */
  portrait: null as string | null,

  links: {
    github: 'https://github.com/hunterom-pe',
    instagram: null as string | null, // add when ready
    calendly: 'https://calendly.com/hunterom8-proton' as string | null, // set to null to hide
  },

  cta: {
    primary: { label: 'Start a project', href: '#contact' },
    secondary: { label: 'View my work', href: '#work' },
  },
} as const

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

/** Credits for third-party imagery. Keep in sync with /CREDITS.md */
export const imageCredits = {
  moon: {
    title: 'Full Moon from Apollo 11 (AS11-44-6667)',
    credit: 'NASA / JSC',
    year: 1969,
    source: 'https://images.nasa.gov/details/as11-44-6667',
  },
} as const
