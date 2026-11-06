/**
 * Portfolio content. Edit text, links and images here.
 *
 * Image sources (see /CREDITS.md):
 * - Precision QA: screenshots of the live site, captured Nov 2026.
 * - iOS apps: Hunter's own App Store screenshots (seller: Hunter Ortega-Mathews).
 */
import pqaDesktop800 from '../assets/work/pqa-desktop-800.webp'
import pqaDesktop1400 from '../assets/work/pqa-desktop-1400.webp'
import pqaMobile from '../assets/work/pqa-mobile-360.webp'
import asl1_400 from '../assets/work/asl-1-400.webp'
import asl1_640 from '../assets/work/asl-1-640.webp'
import asl3_400 from '../assets/work/asl-3-400.webp'
import asl3_640 from '../assets/work/asl-3-640.webp'
import asl5_400 from '../assets/work/asl-5-400.webp'
import asl5_640 from '../assets/work/asl-5-640.webp'
import spec2_400 from '../assets/work/spec-2-400.webp'
import spec2_640 from '../assets/work/spec-2-640.webp'
import spec3_400 from '../assets/work/spec-3-400.webp'
import spec3_640 from '../assets/work/spec-3-640.webp'
import spec6_400 from '../assets/work/spec-6-400.webp'
import spec6_640 from '../assets/work/spec-6-640.webp'
import rollit2_400 from '../assets/work/rollit-2-400.webp'
import rollit2_640 from '../assets/work/rollit-2-640.webp'
import rollit4_400 from '../assets/work/rollit-4-400.webp'
import rollit4_640 from '../assets/work/rollit-4-640.webp'

export type Shot = {
  /** srcset string */
  srcSet: string
  src: string
  alt: string
  width: number
  height: number
}

export type Project = {
  id: string
  number: string
  name: string
  category: string
  description: string
  /** Optional extra detail drawn from the published app / site */
  details?: string[]
  primary: { label: string; href: string }
  github?: string
  shots: Shot[]
}

const phone = (s400: string, s640: string, alt: string): Shot => ({
  srcSet: `${s400} 400w, ${s640} 640w`,
  src: s640,
  alt,
  width: 640,
  height: 1385,
})

export const projects: Project[] = [
  {
    id: 'precision-qa',
    number: '01',
    name: 'Precision QA Consulting',
    category: 'Business Website',
    description:
      'A professional business website designed to present complex technical services with clarity, confidence, and an approachable user experience.',
    primary: { label: 'Visit website', href: 'https://precisionqaconsulting.com' },
    github: 'https://github.com/hunterom-pe/precision-qa',
    shots: [
      {
        srcSet: `${pqaDesktop800} 800w, ${pqaDesktop1400} 1400w`,
        src: pqaDesktop1400,
        alt: 'Precision QA Consulting homepage on desktop: the headline “Ship Software Safely. Integrate AI Flawlessly.” above service highlights and two call-to-action buttons.',
        width: 1400,
        height: 875,
      },
      {
        srcSet: `${pqaMobile} 360w`,
        src: pqaMobile,
        alt: 'The same Precision QA homepage on a phone, with the headline stacked over four lines.',
        width: 360,
        height: 756,
      },
    ],
  },
  {
    id: 'asl',
    number: '02',
    name: 'asl // missed connections',
    category: 'Social Application / iOS',
    description:
      'A nostalgic social application bringing early-internet personality into a modern missed-connections experience.',
    details: ['Local venue “walls”', 'Blind-handshake chat unlocks', 'MySpace-style profile spaces'],
    primary: {
      label: 'View on App Store',
      href: 'https://apps.apple.com/us/app/asl-missed-connections/id6778606848',
    },
    github: 'https://github.com/hunterom-pe/asl-app',
    shots: [
      phone(asl1_400, asl1_640, 'asl home screen: a retro “welcome.exe” panel, a pink “Enter Regional Portal” button and a Cool New People list.'),
      phone(asl3_400, asl3_640, 'asl Missed Connections Wall for a Phoenix venue, with posts and “That Was Me!” buttons in a Y2K web style.'),
      phone(asl5_400, asl5_640, 'asl profile page styled like an early-2000s social profile, with a mood, status, music player and friend space.'),
    ],
  },
  {
    id: 'spec',
    number: '03',
    name: 'Spec // Cocktail Sommelier',
    category: 'Food & Drink / iOS',
    description:
      'A personalized cocktail discovery application combining individual taste preferences with intelligent recommendations.',
    details: ['Scan a bar menu with your camera', '10-dimension taste profile', 'Bartender tips for every pick'],
    primary: {
      label: 'View on App Store',
      href: 'https://apps.apple.com/us/app/spec-cocktail-sommelier/id6779336852',
    },
    github: 'https://github.com/hunterom-pe/bar-som-app',
    shots: [
      phone(spec2_400, spec2_640, 'Spec scanner screen: “Decide in seconds” with a gold “Scan the Menu” button on a black background.'),
      phone(spec3_400, spec3_640, 'Spec palate screen: a gold radar chart of taste dimensions such as sweet, sour, bitter and smoky.'),
      phone(spec6_400, spec6_640, 'Spec recommendation card for an Espresso Noir, with a tasting note and a bartender’s secret tweak.'),
    ],
  },
  {
    id: 'roll-it',
    number: '04',
    name: 'Roll It // Movie Picker',
    category: 'Entertainment / iOS',
    description: 'A native iOS movie discovery application helping people find something worth watching.',
    details: ['Three-question mood quiz', 'Runtime and era filters', 'Checks your streaming services'],
    primary: {
      label: 'View on App Store',
      href: 'https://apps.apple.com/us/app/roll-it-movie-picker/id6788539609',
    },
    github: 'https://github.com/hunterom-pe/roll-it-app',
    shots: [
      phone(rollit2_400, rollit2_640, 'Roll It “Select your vibe” screen: six mood tiles with gold icons on black.'),
      phone(rollit4_400, rollit4_640, 'Roll It “Select an era” screen listing Modern, 2010s, Throwback and Classic.'),
    ],
  },
]
