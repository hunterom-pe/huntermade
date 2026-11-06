import type { CSSProperties } from 'react'
import { about } from '../../data/content'
import { site } from '../../data/site'
import { SectionHead } from '../SectionHead/SectionHead'
import { Portrait } from './Portrait'
import './About.css'

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="03" label="About" titleId="about-title" title={about.title} />

        <div className="about__body">
          <div className="about__portrait" data-reveal>
            <Portrait src={site.portrait} />
          </div>

          <div className="about__copy" data-reveal style={{ '--reveal-delay': '100ms' } as CSSProperties}>
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'about__lead' : undefined}>
                {p}
              </p>
            ))}
            <a className="about__github" href={site.links.github} target="_blank" rel="noopener noreferrer">
              <span className="label">More on GitHub</span>
              <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
