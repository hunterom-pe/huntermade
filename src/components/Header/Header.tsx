import { useCallback, useEffect, useRef, useState } from 'react'
import { navLinks, site } from '../../data/site'
import { Wordmark } from '../Wordmark/Wordmark'
import './Header.css'

const MENU_ID = 'site-menu'

export function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  // While the mobile menu is open: lock scroll, make page content inert,
  // close on Escape, and close automatically if the viewport grows to desktop.
  useEffect(() => {
    if (!open) return

    const root = document.documentElement
    const page = document.querySelectorAll('main, footer')
    root.classList.add('menu-open')
    page.forEach((el) => el.setAttribute('inert', ''))
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const desktop = window.matchMedia('(min-width: 56em)')
    const onResize = () => desktop.matches && close(false)

    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      root.classList.remove('menu-open')
      page.forEach((el) => el.removeAttribute('inert'))
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open, close])

  return (
    <header className={`site-header${open ? ' is-open' : ''}`}>
      <div className="site-header__bar container">
        <a className="site-header__brand" href="#top" aria-label="Hunter Made — back to top">
          <Wordmark size="nav" />
        </a>

        <nav className="site-header__nav" aria-label="Primary">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--small site-header__cta" href={site.cta.primary.href}>
            {site.cta.primary.label}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="site-header__toggle"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="site-header__toggle-label">{open ? 'Close' : 'Menu'}</span>
            <span className="site-header__toggle-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div id={MENU_ID} ref={menuRef} className="site-menu" hidden={!open}>
        <nav aria-label="Mobile" className="site-menu__inner container">
          <ol className="site-menu__list">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => close(false)}>
                  <span className="site-menu__num label" aria-hidden="true">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ol>
          <div className="site-menu__foot">
            <a className="btn" href={site.cta.primary.href} onClick={() => close(false)}>
              {site.cta.primary.label} <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <p className="label">
              {site.location.city}, {site.location.regionShort} — {site.location.coordinates}
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}
