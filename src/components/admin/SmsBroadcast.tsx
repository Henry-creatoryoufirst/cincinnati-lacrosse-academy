'use client'

import { useState, useEffect, FormEvent } from 'react'

function formatPhoneDisplay(phone: string): string {
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  }
  return phone
}

export default function SmsBroadcast() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{
    message: string
    sent?: number
    failed?: number
    configured?: boolean
    phoneNumbers?: string[]
    recipientCount?: number
    errorDetails?: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [phoneCount, setPhoneCount] = useState(0)
  const [smsConfigured, setSmsConfigured] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/admin/send-sms')
      .then(res => res.json())
      .then(data => {
        setPhoneCount(data.phoneSubscriberCount || 0)
        setSmsConfigured(data.smsConfigured || false)
      })
      .catch(() => {})
  }, [])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send SMS')
    } finally {
      setSending(false)
    }
  }

  async function copyPhones(phones: string[]) {
    const formatted = phones.map(p => formatPhoneDisplay(p)).join(', ')
    try {
      await navigator.clipboard.writeText(formatted)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = formatted
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const charCount = message.length
  const segmentCount = charCount <= 160 ? 1 : Math.ceil(charCount / 153)

  return (
    <div style={{
      marginTop: '32px',
      background: 'var(--background)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: 'var(--background-secondary)',
        borderBottom: '1px solid var(--border)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--foreground-muted)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>SMS Broadcast</span>
        <span style={{ textTransform: 'none', letterSpacing: 'normal', fontWeight: 400 }}>
          {phoneCount} subscriber{phoneCount !== 1 ? 's' : ''} with phone numbers
          {!smsConfigured && ' \u00b7 Twilio not configured'}
        </span>
      </div>

      <form onSubmit={handleSend} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Configuration warning */}
        {!smsConfigured && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            fontSize: '0.875rem',
            color: '#92400E',
            lineHeight: 1.5
          }}>
            Twilio is not configured. Add <code style={{ background: '#FEF3C7', fontWeight: 600 }}>TWILIO_ACCOUNT_SID</code>, <code style={{ background: '#FEF3C7', fontWeight: 600 }}>TWILIO_AUTH_TOKEN</code>, and <code style={{ background: '#FEF3C7', fontWeight: 600 }}>TWILIO_PHONE_NUMBER</code> to your environment variables to enable automated SMS. Without these, you can still compose messages and get a list of phone numbers to send manually.
          </div>
        )}

        {/* Message textarea */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--foreground)',
            marginBottom: '6px'
          }}>
            Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g. Training is posted for this Saturday at 10am! Register at cincinnatilacrosseacademy.com"
            rows={4}
            maxLength={1600}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.9375rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--background-secondary)',
              color: 'var(--foreground)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '6px',
            fontSize: '0.75rem',
            color: 'var(--foreground-muted)'
          }}>
            <span>{charCount}/1600 characters</span>
            <span>{segmentCount} SMS segment{segmentCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Send button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="submit"
            disabled={sending || !message.trim() || phoneCount === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: 'none',
              cursor: sending || !message.trim() || phoneCount === 0 ? 'not-allowed' : 'pointer',
              background: '#059669',
              color: 'white',
              opacity: sending || !message.trim() || phoneCount === 0 ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {sending
              ? 'Sending...'
              : smsConfigured
                ? `Send to ${phoneCount} Number${phoneCount !== 1 ? 's' : ''}`
                : `Get ${phoneCount} Phone Number${phoneCount !== 1 ? 's' : ''}`
            }
          </button>
          {!smsConfigured && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--foreground-muted)' }}>
              Returns phone numbers for manual sending.
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            color: '#DC2626',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0'
          }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>
              {result.message}
            </p>

            {result.configured && result.sent !== undefined && (
              <>
                <p style={{ fontSize: '0.8125rem', color: '#065F46' }}>
                  {result.sent} sent, {result.failed} failed
                </p>
                {result.errorDetails && result.errorDetails.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    lineHeight: 1.6
                  }}>
                    {result.errorDetails.map((err, i) => (
                      <div key={i}>{err}</div>
                    ))}
                  </div>
                )}
              </>
            )}

            {!result.configured && result.phoneNumbers && (
              <>
                <p style={{ fontSize: '0.8125rem', color: '#065F46', marginBottom: '8px' }}>
                  {result.phoneNumbers.length} phone number{result.phoneNumbers.length !== 1 ? 's' : ''}:
                </p>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'white',
                  border: '1px solid #D1FAE5',
                  fontSize: '0.8125rem',
                  color: '#1F2937',
                  wordBreak: 'break-all',
                  lineHeight: 1.6
                }}>
                  {result.phoneNumbers.map(p => formatPhoneDisplay(p)).join(', ')}
                </div>
                <button
                  type="button"
                  onClick={() => copyPhones(result.phoneNumbers!)}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: '1px solid #BBF7D0',
                    cursor: 'pointer',
                    background: 'white',
                    color: copied ? '#059669' : '#065F46'
                  }}
                >
                  {copied ? 'Copied!' : 'Copy Phone Numbers'}
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
