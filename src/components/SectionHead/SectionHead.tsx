import type { ReactNode } from 'react'
import './SectionHead.css'

type SectionHeadProps = {
  /** Editorial index, e.g. "01" */
  index: string
  /** Short mono label, e.g. "Services" */
  label: string
  title: ReactNode
  titleId: string
  intro?: ReactNode
  /** 'onDark' for ink sections, 'onOrange' for orange sections */
  tone?: 'default' | 'onOrange' | 'onDark'
}

/** Shared editorial section header: (01) — LABEL, big title, optional intro. */
export function SectionHead({ index, label, title, titleId, intro, tone = 'default' }: SectionHeadProps) {
  return (
    <header className={`section-head section-head--${tone}`} data-reveal>
      <p className="section-head__label label">
        <span className="section-head__index">({index})</span>
        <span aria-hidden="true">—</span>
        {label}
      </p>
      <h2 id={titleId} className="section-head__title">
        {title}
      </h2>
      {intro && <div className="section-head__intro">{intro}</div>}
    </header>
  )
}
