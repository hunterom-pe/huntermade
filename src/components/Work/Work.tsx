import type { CSSProperties } from 'react'
import { work } from '../../data/content'
import { projects } from '../../data/projects'
import { SectionHead } from '../SectionHead/SectionHead'
import { BrowserFrame, PhoneFrame } from './Frames'
import { ProjectInfo } from './ProjectInfo'
import './Work.css'

/**
 * Selected Work — asymmetric editorial layout:
 *   01 large browser feature on orange · 02 expressive lilac showcase ·
 *   03 + 04 as an offset pair (cream / ink).
 * Content comes from data/projects.ts (order matters).
 */
export function Work() {
  const [pqa, asl, spec, rollit] = projects

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          index="02"
          label="Selected work"
          titleId="work-title"
          title={work.title}
          intro={<p>{work.intro}</p>}
        />
      </div>

      <div className="work__projects container">
        {/* 01 — Precision QA: the big one */}
        <article className="project project--feature" aria-labelledby={`project-${pqa.id}`} data-reveal>
          <div className="project__media project__media--feature">
            <BrowserFrame
              shot={pqa.shots[0]}
              url="precisionqaconsulting.com"
              sizes="(min-width: 60em) 58vw, 92vw"
              className="feature__browser"
            />
            <PhoneFrame shot={pqa.shots[1]} sizes="180px" className="feature__phone" />
            <span className="project__square project__square--feature" aria-hidden="true" />
          </div>
          <ProjectInfo project={pqa} />
        </article>

        {/* 02 — asl: expressive retro showcase */}
        <article className="project project--showcase" aria-labelledby={`project-${asl.id}`} data-reveal>
          <ProjectInfo project={asl} />
          <div className="project__media project__media--fan">
            {asl.shots.map((shot, i) => (
              <PhoneFrame
                key={shot.src}
                shot={shot}
                sizes="(min-width: 60em) 18vw, 40vw"
                className={`fan__phone fan__phone--${i + 1}`}
              />
            ))}
            <span className="showcase__tag label" aria-hidden="true">
              welcome.exe
            </span>
          </div>
        </article>

        {/* 03 + 04 — complementary pair */}
        <div className="work__pair">
          <article className="project project--pair project--spec" aria-labelledby={`project-${spec.id}`} data-reveal>
            <div className="project__media project__media--duo">
              <PhoneFrame shot={spec.shots[0]} sizes="(min-width: 60em) 16vw, 42vw" className="duo__phone duo__phone--1" />
              <PhoneFrame shot={spec.shots[2]} sizes="(min-width: 60em) 16vw, 42vw" className="duo__phone duo__phone--2" />
            </div>
            <ProjectInfo project={spec} />
          </article>

          <article
            className="project project--pair project--rollit"
            aria-labelledby={`project-${rollit.id}`}
            data-reveal
            style={{ '--reveal-delay': '120ms' } as CSSProperties}
          >
            <div className="project__media project__media--duo">
              <PhoneFrame shot={rollit.shots[0]} sizes="(min-width: 60em) 14vw, 42vw" className="duo__phone duo__phone--1" />
              <PhoneFrame shot={rollit.shots[1]} sizes="(min-width: 60em) 14vw, 42vw" className="duo__phone duo__phone--2" />
            </div>
            <ProjectInfo project={rollit} tone="dark" />
          </article>
        </div>
      </div>
    </section>
  )
}
