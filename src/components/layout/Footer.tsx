'use client'

import { useState, FormEvent } from 'react'

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#ffffff',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone ? phone.replace(/\D/g, '') : undefined,
          source: 'footer',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setMessage('You\'re in! We\'ll keep you posted.')
      setEmail('')
      setPhone('')
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <footer
      style={{
        background: '#1A1A1A',
        color: '#ffffff',
        padding: '64px 0 32px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            marginBottom: '48px',
          }}
          className="footer-grid-responsive"
        >
          {/* Brand */}
          <div style={{ maxWidth: '400px' }}>
            <a
              href="/"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              Cincinnati Lacrosse Academy
            </a>
            <p
              style={{
                marginTop: '16px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
              }}
            >
              World-class lacrosse training in Cincinnati. Building complete players
              from youth to collegiate level.
            </p>
          </div>

          {/* Email Signup */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}
            >
              Stay in the Loop
            </h4>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                marginBottom: '16px',
                lineHeight: 1.6,
              }}
            >
              Get updates on training sessions, camps, and events.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status !== 'idle' && status !== 'loading') setStatus('idle') }}
                  style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#1A1A1A',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {status === 'loading' ? 'Sending...' : 'Sign Up'}
                </button>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                style={inputStyle}
              />
            </form>
            {status === 'success' && (
              <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#4ade80' }}>{message}</p>
            )}
            {status === 'error' && (
              <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#f87171' }}>{message}</p>
            )}
          </div>

          {/* External Links */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}
            >
              Connect
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              {[
                { label: 'YouTube', href: 'https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw' },
                { label: 'Podcast', href: 'https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186' },
                { label: 'You.Prjct App', href: 'https://youprjct.com' },
                { label: 'Instagram', href: 'https://www.instagram.com/cincinnati_lax_acdmy?igsh=OXBqeGs5cmtyNjdy&utm_source=qr' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.875rem',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>&copy; {new Date().getFullYear()} Cincinnati Lacrosse Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
