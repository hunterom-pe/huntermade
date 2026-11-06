import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { faq } from '../../data/content'
import { Faq } from './Faq'

const items = () => [...document.querySelectorAll<HTMLDetailsElement>('details.faq__item')]

describe('FAQ accordion', () => {
  it('renders every question with its answer in the DOM, all collapsed', () => {
    render(<Faq />)
    expect(screen.getByRole('heading', { level: 2, name: /a few good questions/i })).toBeInTheDocument()
    expect(items()).toHaveLength(faq.items.length)
    expect(items().every((d) => !d.open)).toBe(true)
    // answers exist in the markup even while collapsed (crawlable, find-in-page)
    for (const { a } of faq.items) expect(document.body.textContent).toContain(a)
  })

  it('does not publish prices', () => {
    render(<Faq />)
    expect(document.querySelector('.faq')!.textContent).not.toMatch(/\$\s?\d/)
  })

  // Keyboard activation of <summary> is native browser behaviour (jsdom doesn't
  // emulate it); it's verified in a real browser instead.
  it('keeps only one answer open at a time', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const [first, second] = items()

    await user.click(first.querySelector('summary')!)
    await waitFor(() => expect(first.open).toBe(true))

    await user.click(second.querySelector('summary')!)
    await waitFor(() => expect(second.open).toBe(true))
    await waitFor(() => expect(first.open).toBe(false))
    expect(items().filter((d) => d.open)).toHaveLength(1)
  })
})
