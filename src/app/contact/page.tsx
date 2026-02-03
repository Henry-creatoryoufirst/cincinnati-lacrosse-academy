'use client'

import { useState } from 'react'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '1rem',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  background: '#f9fafb',
  color: '#0a0a0a',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit'
}

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = '#2563eb'
  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
  e.target.style.background = 'white'
}

function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = '#e5e7eb'
  e.target.style.boxShadow = 'none'
  e.target.style.background = '#f9fafb'
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSuccess(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Success State
  if (isSuccess) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '12px' }}>
            Message Sent!
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}>
            Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            style={{
              padding: '14px 32px',
              background: 'white',
              color: '#0a0a0a',
              fontSize: '0.9375rem',
              fontWeight: 600,
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.background = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.background = 'white'
            }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <main>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(180deg, #111827 0%, #0a0a0b 100%)',
        padding: '140px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.8125rem',
              textDecoration: 'none',
              marginBottom: '40px',
              transition: 'color 0.2s ease',
              letterSpacing: '0.03em'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            <span>←</span> Back to Home
          </Link>

          <div style={{
            width: '48px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            margin: '0 auto 28px'
          }} />

          <h1 style={{
            fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px'
          }}>
            Contact Us
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 400,
            maxWidth: '440px',
            margin: '0 auto'
          }}>
            We&apos;d love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{
        padding: '80px 24px 120px',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px'
          }} className="contact-grid">

            {/* Left Column - Contact Info */}
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0a0a0a',
                marginBottom: '32px',
                letterSpacing: '-0.02em'
              }}>
                Get in Touch
              </h2>

              {/* Contact Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Text */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#eff6ff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>TEXT</p>
                    <a
                      href="sms:+15134445199"
                      style={{
                        fontSize: '1rem',
                        color: '#0a0a0a',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      (513) 444-5199
                    </a>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: '6px 0 0', lineHeight: 1.4 }}>
                      Text only — no calls please
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div style={{ marginTop: '40px' }}>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#9ca3af',
                  marginBottom: '16px'
                }}>
                  Follow Us
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: '#f3f4f6',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0a0a0a'
                      const svg = e.currentTarget.querySelector('svg')
                      if (svg) svg.style.stroke = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      const svg = e.currentTarget.querySelector('svg')
                      if (svg) svg.style.stroke = '#374151'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                      <path d="m10 15 5-3-5-3z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/cincinnati_lax_acdmy?igsh=OXBqeGs5cmtyNjdy&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: '#f3f4f6',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0a0a0a'
                      const svg = e.currentTarget.querySelector('svg')
                      if (svg) svg.style.stroke = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      const svg = e.currentTarget.querySelector('svg')
                      if (svg) svg.style.stroke = '#374151'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>

                  {/* Podcast */}
                  <a
                    href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: '#f3f4f6',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0a0a0a'
                      const svg = e.currentTarget.querySelector('svg')
                      if (svg) svg.style.stroke = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      const svg = e.currentTarget.querySelector('svg')
                      if (svg) svg.style.stroke = '#374151'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
                      <path d="M6 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"/>
                      <circle cx="12" cy="11" r="3"/>
                      <path d="M12 14v4"/>
                      <path d="M10 18h4"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e5e7eb',
                padding: '36px'
              }}>
                <h2 style={{
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: '#0a0a0a',
                  marginBottom: '6px',
                  letterSpacing: '-0.01em'
                }}>
                  Send Us a Message
                </h2>
                <p style={{
                  fontSize: '0.9375rem',
                  color: '#6b7280',
                  marginBottom: '28px'
                }}>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                  You can also text us directly at{' '}
                  <a href="sms:+15134445199" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>(513) 444-5199</a>.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Name & Email Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px'
                  }} className="form-row">
                    <div>
                      <label htmlFor="name" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '8px'
                      }}>Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '8px'
                      }}>Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px'
                  }} className="form-row">
                    <div>
                      <label htmlFor="phone" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '8px'
                      }}>Phone <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(513) 444-5199"
                        value={formData.phone}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '8px'
                      }}>Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        style={{
                          ...inputStyle,
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 14px center',
                          paddingRight: '40px',
                          cursor: 'pointer'
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      >
                        <option value="">Select a topic</option>
                        <option value="training">Weekend Training</option>
                        <option value="membership">Membership Inquiry</option>
                        <option value="strength">Strength Training</option>
                        <option value="remote">Remote Coaching</option>
                        <option value="private">Private Lessons</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="message" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '8px'
                    }}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        minHeight: '140px'
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div style={{
                      padding: '12px 16px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '12px',
                      color: '#dc2626',
                      fontSize: '0.875rem',
                      marginBottom: '16px'
                    }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: isLoading ? '#9ca3af' : '#2563eb',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '12px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background 0.2s ease, transform 0.2s ease',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = '#1d4ed8'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = '#2563eb'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 2-7 20-4-9-9-4z"/>
                          <path d="M22 2 11 13"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive CSS */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 340px 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
