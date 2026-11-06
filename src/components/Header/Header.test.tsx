import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'
import { Header } from './Header'

beforeAll(() => {
  window.matchMedia ||= ((q: string) =>
    ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList)
})

describe('Header mobile menu', () => {
  it('opens, moves focus into the menu, and closes on Escape', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Header />
        <main>page</main>
      </>,
    )
    const toggle = screen.getByRole('button', { name: /menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const mobileNav = screen.getByRole('navigation', { name: /mobile/i })
    expect(mobileNav.querySelector('a')).toHaveFocus()
    expect(document.querySelector('main')).toHaveAttribute('inert')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
    expect(document.querySelector('main')).not.toHaveAttribute('inert')
  })

  it('links to every section', () => {
    render(<Header />)
    const primary = screen.getByRole('navigation', { name: /primary/i })
    const hrefs = [...primary.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['#work', '#services', '#about', '#contact'])
  })
})
