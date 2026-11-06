import type { CSSProperties } from 'react'
import { imageCredits, site } from '../../data/site'
import { Wordmark } from '../Wordmark/Wordmark'
import moon640 from '../../assets/hero/moon-640.webp'
import moon1000 from '../../assets/hero/moon-1000.webp'
import moon1500 from '../../assets/hero/moon-1500.webp'
import moon1000Jpg from '../../assets/hero/moon-1000.jpg'
import './Hero.css'

const delay = (ms: number) => ({ '--enter-delay': `${ms}ms` }) as CSSProperties

export function Hero() {
  const { moon } = imageCredits

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        <p className="hero__label label" data-enter style={delay(0)}>
          <span className="hero__label-mark" aria-hidden="true" />
          Independent web &amp; app development — {site.location.city}, {site.location.regionShort}
        </p>

        <div className="hero__mark" data-enter="wipe" style={delay(80)}>
          <Wordmark size="poster" />
        </div>

        <h1 id="hero-title" className="hero__title" data-enter style={delay(260)}>
          The internet could use a little more personality.
        </h1>

        <p className="hero__lead" data-enter style={delay(360)}>
          I’m Hunter, a Phoenix-based developer creating distinctive websites and digital
          experiences for businesses that want to stand out.
        </p>

        <div className="hero__ctas" data-enter style={delay(440)}>
          <a className="btn" href={site.cta.primary.href}>
            {site.cta.primary.label}
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a className="btn btn--ghost" href={site.cta.secondary.href}>
            {site.cta.secondary.label}
          </a>
        </div>


        {/* ---- Signature art: lunar photograph + orange geometry ---- */}
        <figure className="hero__art">
          <div className="hero__photo" data-enter="fade" style={delay(100)}>
            <picture>
              <source
                type="image/webp"
                srcSet={`${moon640} 640w, ${moon1000} 1000w, ${moon1500} 1500w`}
                sizes="(min-width: 60em) 60vw, 130vw"
              />
              <img
                className="hero__moon"
                src={moon1000Jpg}
                width={1000}
                height={1000}
                alt="Black-and-white photograph of the full Moon, its craters and dark plains in sharp detail."
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>

          <div className="hero__grid-lines" aria-hidden="true">
            <span className="hero__cross hero__cross--a" />
            <span className="hero__cross hero__cross--b" />
          </div>

          <span className="hero__block hero__block--a" data-enter="slide-x" style={delay(380)} aria-hidden="true">
            <span className="hero__block-text label">
              <span>Websites</span>
              <span>Apps</span>
              <span>Redesigns</span>
            </span>
          </span>
          <span className="hero__block hero__block--b" data-enter="slide-y" style={delay(520)} aria-hidden="true" />
          <span className="hero__block hero__block--c" data-enter="slide-y" style={delay(640)} aria-hidden="true" />

          <span className="hero__fig label" aria-hidden="true">
            Fig. 01
          </span>
          <figcaption className="hero__caption label">
            Full Moon, Apollo 11, {moon.year}. Photo: {moon.credit}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
