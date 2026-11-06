import { describe, expect, it } from 'vitest'
import { ALL_SUBMITTED_FIELDS, encode, validate, type FormValues } from './form'

const valid: FormValues = {
  name: 'Jo Customer',
  email: 'jo@example.com',
  business: '',
  website: '',
  projectType: 'New website',
  budget: '',
  message: 'We need a new site for our bakery.',
}

describe('validate', () => {
  it('accepts a complete submission with optional fields empty', () => {
    expect(validate(valid)).toEqual({})
  })

  it('requires name, email, project type and message', () => {
    const errors = validate({ ...valid, name: ' ', email: '', projectType: '', message: '' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'projectType'])
  })

  it('never requires business, website or budget', () => {
    const errors = validate(valid)
    expect(errors.business).toBeUndefined()
    expect(errors.website).toBeUndefined()
    expect(errors.budget).toBeUndefined()
  })

  it.each(['jo@', 'jo@example', 'jo example.com', '@example.com'])('rejects malformed email %s', (email) => {
    expect(validate({ ...valid, email }).email).toBeDefined()
  })

  it.each(['example.com', 'www.my-shop.co', 'https://example.com/menu'])('accepts website %s', (website) => {
    expect(validate({ ...valid, website }).website).toBeUndefined()
  })

  it('rejects an obviously invalid website but only when filled in', () => {
    expect(validate({ ...valid, website: 'not a site' }).website).toBeDefined()
  })

  it('asks for a slightly longer message when it is very short', () => {
    expect(validate({ ...valid, message: 'hi' }).message).toMatch(/at least/)
  })
})

describe('encode', () => {
  it('produces x-www-form-urlencoded output', () => {
    expect(encode({ 'form-name': 'contact', message: 'a & b' })).toBe('form-name=contact&message=a+%26+b')
  })
})

describe('submitted field list', () => {
  it('includes the visible fields, tracking fields and the honeypot', () => {
    for (const f of ['name', 'email', 'business', 'website', 'projectType', 'budget', 'message', 'utm_source', 'landing_page', 'referrer', 'bot-field'])
      expect(ALL_SUBMITTED_FIELDS).toContain(f)
  })
})
