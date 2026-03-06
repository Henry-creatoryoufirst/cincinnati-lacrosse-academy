'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function ContactCollectionSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || undefined,
          phone: formData.phone ? formData.phone.replace(/\D/g, '') : undefined,
          source: 'homepage_cta',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setMessage("You're in. We'll keep you posted on sessions and events.")
      setFormData({ name: '', email: '', phone: '' })
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '0.9375rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <section
      style={{
        background: '#111827',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <span
            style={{
              display: 'block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#60A5FA',
              marginBottom: '16px',
            }}
          >
            Stay Connected
          </span>

          {/* Heading */}
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 600,
              color: 'white',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            Never Miss a Session
          </h2>

          {/* Subtext */}
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}
          >
            Get notified about training sessions, camps, and events. We only reach out when it matters.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '32px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ color: 'white', fontWeight: 500, fontSize: '1.125rem', marginBottom: '4px' }}>You&apos;re in.</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>{message}</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Name (optional) */}
              <input
                type="text"
                placeholder="Your name (optional)"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                style={inputStyle}
              />

              {/* Email (required) */}
              <input
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={inputStyle}
              />

              {/* Phone (optional) */}
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneInput(e.target.value) }))}
                style={inputStyle}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  background: 'white',
                  color: '#1A1A1A',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.5 : 1,
                  transition: 'opacity 0.2s, background 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {status === 'loading' ? 'Joining...' : 'Join the Community'}
              </button>

              {/* Error */}
              {status === 'error' && (
                <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{message}</p>
              )}

              {/* Privacy note */}
              <p style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.75rem', marginTop: '4px' }}>
                We&apos;ll only text you about training. No spam, ever.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
