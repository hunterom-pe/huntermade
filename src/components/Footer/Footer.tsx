import { navLinks, site } from '../../data/site'
import { Wordmark } from '../Wordmark/Wordmark'
import './Footer.css'

// Evaluated once at module load (keeps render pure)
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <a href="#top" className="site-footer__brand" aria-label="Hunter Made, back to top">
            <Wordmark size="poster" tone="onInk" />
          </a>
          <p className="site-footer__tagline">{site.tagline}</p>
        </div>

        <div className="site-footer__grid">
          <div>
            <p className="site-footer__heading label">Based in</p>
            <p>
              {site.location.city}, {site.location.region}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="site-footer__heading label">Explore</p>
            <ul className="site-footer__list">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="site-footer__heading label">Elsewhere</p>
            <ul className="site-footer__list">
              <li>
                <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
              {site.links.instagram && (
                <li>
                  <a href={site.links.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram<span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="site-footer__cta">
            <a className="btn" href={site.cta.primary.href}>
              {site.cta.primary.label} <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="site-footer__legal label">
          <p suppressHydrationWarning>
            © {YEAR} {site.name}. All rights reserved.
          </p>
          {/* Privacy page is added in Stage 3 */}
          <a href="/privacy/">Privacy policy</a>
        </div>
      </div>
    </footer>
  )
}
