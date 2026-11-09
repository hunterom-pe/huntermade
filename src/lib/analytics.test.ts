import { afterEach, describe, expect, it, vi } from 'vitest'
import { initAnalytics, track, UMAMI_SCRIPT } from './analytics'

const ID = 'cb8ddcde-d838-48c6-ad86-6e2d260a9a3b'
const scripts = () => [...document.head.querySelectorAll('script')]

afterEach(() => {
  document.head.innerHTML = ''
  delete window.umami
})

describe('analytics (Umami)', () => {
  it('loads nothing when no website ID is configured', () => {
    initAnalytics({ websiteId: null })
    expect(scripts()).toHaveLength(0)
    expect(() => track('contact_submitted')).not.toThrow()
  })

  it('adds the Umami script with the website ID and tracked domain', () => {
    initAnalytics({ websiteId: ID, domains: 'huntermade.studio' })
    const [s] = scripts()
    expect(s.getAttribute('src')).toBe(UMAMI_SCRIPT)
    expect(s.getAttribute('data-website-id')).toBe(ID)
    expect(s.getAttribute('data-domains')).toBe('huntermade.studio')
    expect(s.defer).toBe(true)
  })

  it('uses the website ID from site config by default', () => {
    initAnalytics()
    expect(scripts()[0]?.getAttribute('data-website-id')).toBe(ID)
  })

  it('rejects a malformed website ID and never adds the script twice', () => {
    initAnalytics({ websiteId: 'not-an-id' })
    expect(scripts()).toHaveLength(0)
    initAnalytics({ websiteId: ID })
    initAnalytics({ websiteId: ID })
    expect(scripts()).toHaveLength(1)
  })

  it('sends custom events to Umami and never throws', () => {
    const trackFn = vi.fn()
    window.umami = { track: trackFn }
    track('contact_submitted', { projectType: 'New website' })
    expect(trackFn).toHaveBeenCalledWith('contact_submitted', { projectType: 'New website' })
    window.umami = { track: () => { throw new Error('blocked') } }
    expect(() => track('contact_submitted')).not.toThrow()
  })
})
