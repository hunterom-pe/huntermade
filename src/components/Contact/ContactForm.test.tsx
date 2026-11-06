import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from './ContactForm'

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), 'Jo Customer')
  await user.type(screen.getByLabelText(/^email/i), 'jo@example.com')
  await user.selectOptions(screen.getByLabelText(/project type/i), 'Website redesign')
  await user.type(screen.getByLabelText(/tell me about your project/i), 'Our site is from 2012 and it shows.')
}

afterEach(() => vi.unstubAllGlobals())

describe('ContactForm', () => {
  it('labels every field and marks optional ones', () => {
    render(<ContactForm />)
    for (const l of [/^name/i, /^email/i, /business name/i, /existing website/i, /project type/i, /estimated budget/i, /tell me about/i])
      expect(screen.getByLabelText(l)).toBeInTheDocument()
    expect(screen.getByLabelText(/estimated budget/i)).not.toHaveAttribute('aria-required')
    expect(screen.getByLabelText(/^email/i)).toHaveAttribute('aria-required', 'true')
  })

  it('shows errors for empty required fields and focuses the first one', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByLabelText(/^name/i)).toHaveFocus()
    expect(screen.getByLabelText(/^name/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/tell me your name/i)).toBeInTheDocument()
    expect(screen.getByText(/add your email/i)).toBeInTheDocument()
    expect(screen.getByText(/choose the option/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits url-encoded data with form-name and attribution, then shows success', async () => {
    sessionStorage.setItem('hm_attribution', JSON.stringify({ utm_source: 'instagram', landing_page: '/' }))
    let resolve!: (r: Response) => void
    const fetchMock = vi.fn(() => new Promise<Response>((r) => (resolve = r)))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<ContactForm />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    // loading state
    expect(screen.getByRole('button', { name: /sending/i })).toHaveAttribute('aria-disabled', 'true')

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/__forms.html')
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/x-www-form-urlencoded')
    const body = new URLSearchParams(init.body as string)
    expect(body.get('form-name')).toBe('contact')
    expect(body.get('name')).toBe('Jo Customer')
    expect(body.get('projectType')).toBe('Website redesign')
    expect(body.get('budget')).toBe('')
    expect(body.get('utm_source')).toBe('instagram')
    expect(body.get('bot-field')).toBe('')

    resolve(new Response('', { status: 200 }))
    expect(await screen.findByRole('heading', { name: /message received/i })).toHaveFocus()
  })

  it('shows a recoverable error and keeps the visitor’s text when the server fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })))
    const user = userEvent.setup()
    render(<ContactForm />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/didn’t go through/i)
    expect(screen.getByLabelText(/^name/i)).toHaveValue('Jo Customer')
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('treats a network failure as an error, not a success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('offline'))))
    const user = userEvent.setup()
    render(<ContactForm />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.queryByText(/message received/i)).not.toBeInTheDocument()
  })
})
