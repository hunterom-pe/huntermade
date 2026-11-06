import { credibility } from '../../data/content'
import './Credibility.css'

/**
 * Compact proof strip between Work and About.
 * Note: "13+" is software-quality experience, not web-dev experience.
 */
export function Credibility() {
  return (
    <section className="cred" aria-label="Experience at a glance">
      <div className="cred__inner container" data-reveal>
        <dl className="cred__stats">
          {credibility.stats.map((s) => (
            <div key={s.label} className="cred__stat">
              <dt className="cred__label label">{s.label}</dt>
              <dd className="cred__value">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="cred__line">
          <span className="cred__mark" aria-hidden="true" />
          {credibility.line}
        </p>
      </div>
    </section>
  )
}
