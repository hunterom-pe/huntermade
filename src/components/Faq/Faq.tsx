import { useRef, type SyntheticEvent } from 'react'
import { faq } from '../../data/content'
import { SectionHead } from '../SectionHead/SectionHead'
import './Faq.css'

/**
 * Compact FAQ accordion built on native <details>/<summary>:
 * - keyboard support and expanded state come from the browser (no ARIA wiring needed)
 * - answers stay in the HTML when collapsed, so they're indexable and findable with Ctrl/Cmd+F
 * - `name` makes the group exclusive (one open at a time) in modern browsers;
 *   the onToggle handler enforces the same behaviour everywhere else.
 */
export function Faq() {
  const listRef = useRef<HTMLDivElement>(null)

  const onToggle = (e: SyntheticEvent<HTMLDetailsElement>) => {
    const opened = e.currentTarget
    if (!opened.open) return
    listRef.current?.querySelectorAll('details[open]').forEach((d) => {
      if (d !== opened) (d as HTMLDetailsElement).open = false
    })
  }

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container faq__layout">
        <div className="faq__head">
          <SectionHead index="05" label="FAQ" titleId="faq-title" title={faq.title} />
        </div>

        <div className="faq__list" ref={listRef} data-reveal>
          {faq.items.map((item, i) => (
            <details key={item.q} className="faq__item" name="faq" onToggle={onToggle}>
              <summary className="faq__q">
                <span className="faq__num label" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="faq__q-text">{item.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
