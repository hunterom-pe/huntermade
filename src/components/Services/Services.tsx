import type { CSSProperties } from 'react'
import { services } from '../../data/content'
import { SectionHead } from '../SectionHead/SectionHead'
import './Services.css'

export function Services() {
  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          index="01"
          label="Services"
          titleId="services-title"
          title={services.title}
          intro={<p>{services.intro}</p>}
        />

        <ol className="services__list">
          {services.items.map((item, i) => (
            <li
              key={item.number}
              className="service"
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
            >
              <span className="service__number" aria-hidden="true">
                {item.number}
              </span>
              <h3 className="service__title">
                <span className="service__mark" aria-hidden="true" />
                {item.title}
              </h3>
              <p className="service__body">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
