import { describe, expect, it } from 'vitest'
import { captureAttribution, getAttribution, parseAttribution } from './attribution'

describe('parseAttribution', () => {
  it('captures utm parameters, landing path and referring domain', () => {
    const a = parseAttribution(
      'https://huntermade.test/?utm_source=instagram&utm_medium=paid_social&utm_campaign=fall&fbclid=abc',
      'https://l.instagram.com/some/path?x=1',
    )
    expect(a).toEqual({
      utm_source: 'instagram',
      utm_medium: 'paid_social',
      utm_campaign: 'fall',
      landing_page: '/',
      referrer: 'l.instagram.com',
    })
  })

  it('ignores non-UTM parameters and same-site referrers', () => {
    const a = parseAttribution('https://huntermade.test/privacy/?gclid=1', 'https://huntermade.test/')
    expect(a).toEqual({ landing_page: '/privacy/' })
  })

  it('sanitises and truncates values', () => {
    const a = parseAttribution(`https://x.test/?utm_source=${'<b>'.repeat(10)}${'a'.repeat(300)}`, '')
    expect(a.utm_source).not.toMatch(/[<>]/)
    expect(a.utm_source!.length).toBeLessThanOrEqual(150)
  })
})

describe('first-touch storage', () => {
  it('keeps the first landing data for the session', () => {
    window.history.replaceState({}, '', '/?utm_source=facebook')
    captureAttribution()
    window.history.replaceState({}, '', '/?utm_source=google')
    captureAttribution()
    expect(getAttribution().utm_source).toBe('facebook')
  })
})
