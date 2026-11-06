import type { CSSProperties } from 'react'
import { processSteps } from '../../data/content'
import { SectionHead } from '../SectionHead/SectionHead'
import './Process.css'

export function Process() {
  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead index="04" label="Process" titleId="process-title" title={processSteps.title} tone="onOrange" />

        <ol className="process__steps">
          {processSteps.steps.map((step, i) => (
            <li
              key={step.number}
              className="step"
              data-reveal
              style={{ '--reveal-delay': `${i * 120}ms` } as CSSProperties}
            >
              <span className="step__number" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
