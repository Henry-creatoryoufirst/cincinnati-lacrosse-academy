'use client'

import { useState, useEffect, useCallback } from 'react'

interface Subscriber {
  id: string
  email: string
  name?: string | null
  phone?: string | null
  source?: string | null
  is_active: boolean
  created_at: string
}

function formatPhoneDisplay(phone: string): string {
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  }
  return phone
}

export default function SubscriberList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [phonesCopied, setPhonesCopied] = useState(false)

  // Compose section state
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [composeResult, setComposeResult] = useState<{ recipients: string[]; message: string } | null>(null)
  const [composeError, setComposeError] = useState<string | null>(null)

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/subscribers')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch subscribers')
      }
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  async function handleExportCSV() {
    try {
      const res = await fetch('/api/subscribers?format=csv')
      if (!res.ok) throw new Error('Failed to export')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  async function handleCopyEmails() {
    const activeEmails = subscribers
      .filter(s => s.is_active)
      .map(s => s.email)
      .join(', ')

    try {
      await navigator.clipboard.writeText(activeEmails)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = activeEmails
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleCopyPhones() {
    const activePhones = subscribers
      .filter(s => s.is_active && s.phone)
      .map(s => formatPhoneDisplay(s.phone!))
      .join(', ')

    try {
      await navigator.clipboard.writeText(activePhones)
      setPhonesCopied(true)
      setTimeout(() => setPhonesCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = activePhones
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setPhonesCopied(true)
      setTimeout(() => setPhonesCopied(false), 2000)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/subscribers?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete subscriber')
      }
      setDeleteConfirmId(null)
      setSubscribers(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleCompose(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return

    setSending(true)
    setComposeResult(null)
    setComposeError(null)

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setComposeResult({ recipients: data.recipients || [], message: data.message || 'Done' })
    } catch (err) {
      setComposeError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const activeCount = subscribers.filter(s => s.is_active).length
  const inactiveCount = subscribers.filter(s => !s.is_active).length

  return (
    <>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        marginTop: '48px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--foreground)',
          letterSpacing: '-0.01em'
        }}>
          Email Subscribers
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyEmails}
            disabled={subscribers.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              cursor: subscribers.length === 0 ? 'not-allowed' : 'pointer',
              background: 'transparent',
              color: copied ? '#059669' : 'var(--foreground)',
              transition: 'all 0.2s ease',
              opacity: subscribers.length === 0 ? 0.5 : 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copied ? 'Copied!' : 'Copy All Emails'}
          </button>
          <button
            onClick={handleCopyPhones}
            disabled={subscribers.filter(s => s.is_active && s.phone).length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              cursor: subscribers.filter(s => s.is_active && s.phone).length === 0 ? 'not-allowed' : 'pointer',
              background: 'transparent',
              color: phonesCopied ? '#059669' : 'var(--foreground)',
              transition: 'all 0.2s ease',
              opacity: subscribers.filter(s => s.is_active && s.phone).length === 0 ? 0.5 : 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {phonesCopied ? 'Copied!' : 'Copy All Phones'}
          </button>
          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: 'none',
              cursor: subscribers.length === 0 ? 'not-allowed' : 'pointer',
              background: 'var(--foreground)',
              color: 'var(--background)',
              transition: 'all 0.2s ease',
              opacity: subscribers.length === 0 ? 0.5 : 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          background: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '64px 24px',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
            Loading subscribers...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          background: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '64px 24px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#DC2626', fontSize: '0.9375rem', marginBottom: '16px' }}>
            {error}
          </p>
          <button
            onClick={fetchSubscribers}
            style={{
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              background: 'transparent',
              color: 'var(--foreground)'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && subscribers.length === 0 && (
        <div style={{
          background: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '64px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--background-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>
            No subscribers yet
          </h3>
          <p style={{ color: 'var(--foreground-muted)' }}>
            Subscribers will appear here once people sign up via your email form.
          </p>
        </div>
      )}

      {/* Subscriber List */}
      {!loading && !error && subscribers.length > 0 && (
        <div style={{
          background: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          {/* Active Subscribers */}
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
            <span>Active ({activeCount})</span>
            <span style={{ textTransform: 'none', letterSpacing: 'normal', fontWeight: 400 }}>
              {subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {subscribers.filter(s => s.is_active).map((subscriber, idx, arr) => (
            <SubscriberRow
              key={subscriber.id}
              subscriber={subscriber}
              isLast={idx === arr.length - 1 && inactiveCount === 0}
              deletingId={deletingId}
              deleteConfirmId={deleteConfirmId}
              onDelete={handleDelete}
              setDeleteConfirmId={setDeleteConfirmId}
              formatDate={formatDate}
            />
          ))}

          {/* Inactive Subscribers */}
          {inactiveCount > 0 && (
            <>
              <div style={{
                padding: '16px 24px',
                background: 'var(--background-secondary)',
                borderBottom: '1px solid var(--border)',
                borderTop: activeCount > 0 ? '1px solid var(--border)' : 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--foreground-muted)'
              }}>
                Inactive ({inactiveCount})
              </div>
              {subscribers.filter(s => !s.is_active).map((subscriber, idx, arr) => (
                <SubscriberRow
                  key={subscriber.id}
                  subscriber={subscriber}
                  isLast={idx === arr.length - 1}
                  isInactive
                  deletingId={deletingId}
                  deleteConfirmId={deleteConfirmId}
                  onDelete={handleDelete}
                  setDeleteConfirmId={setDeleteConfirmId}
                  formatDate={formatDate}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Compose Section */}
      <div style={{
        marginTop: '32px',
        background: 'var(--background)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          background: 'var(--background-secondary)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--foreground-muted)'
        }}>
          Compose Email
        </div>
        <form onSubmit={handleCompose} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--foreground)',
              marginBottom: '6px'
            }}>
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Email subject line..."
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '0.9375rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--background-secondary)',
                color: 'var(--foreground)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--foreground)',
              marginBottom: '6px'
            }}>
              Body
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your email body here..."
              rows={6}
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
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="submit"
              disabled={sending || !subject.trim() || !body.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.9375rem',
                fontWeight: 500,
                borderRadius: '9999px',
                border: 'none',
                cursor: sending || !subject.trim() || !body.trim() ? 'not-allowed' : 'pointer',
                background: 'var(--accent)',
                color: 'white',
                opacity: sending || !subject.trim() || !body.trim() ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              {sending ? 'Sending...' : 'Get Recipient List'}
            </button>
            <span style={{ fontSize: '0.8125rem', color: 'var(--foreground-muted)' }}>
              Returns the list of recipients so you can send via your email client.
            </span>
          </div>

          {/* Compose Error */}
          {composeError && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FEE2E2',
              color: '#DC2626',
              fontSize: '0.875rem'
            }}>
              {composeError}
            </div>
          )}

          {/* Compose Result */}
          {composeResult && (
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0'
            }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>
                {composeResult.message}
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#065F46', marginBottom: '8px' }}>
                {composeResult.recipients.length} recipient{composeResult.recipients.length !== 1 ? 's' : ''}:
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
                {composeResult.recipients.join(', ')}
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(composeResult.recipients.join(', '))
                  } catch {
                    const textarea = document.createElement('textarea')
                    textarea.value = composeResult.recipients.join(', ')
                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textarea)
                  }
                }}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: '1px solid #BBF7D0',
                  cursor: 'pointer',
                  background: 'white',
                  color: '#059669'
                }}
              >
                Copy Recipients
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  )
}

interface SubscriberRowProps {
  subscriber: Subscriber
  isLast?: boolean
  isInactive?: boolean
  deletingId: string | null
  deleteConfirmId: string | null
  onDelete: (id: string) => void
  setDeleteConfirmId: (id: string | null) => void
  formatDate: (date: string) => string
}

function SubscriberRow({
  subscriber,
  isLast,
  isInactive,
  deletingId,
  deleteConfirmId,
  onDelete,
  setDeleteConfirmId,
  formatDate
}: SubscriberRowProps) {
  const isLoading = deletingId === subscriber.id
  const isDeleting = deleteConfirmId === subscriber.id

  return (
    <div style={{
      padding: '20px 24px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      opacity: isInactive ? 0.6 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Subscriber Info */}
      <div style={{ flex: 1, minWidth: '240px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--foreground)',
            margin: 0
          }}>
            {subscriber.email}
          </h3>
          <span style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            background: subscriber.is_active ? '#D1FAE5' : '#FEE2E2',
            color: subscriber.is_active ? '#059669' : '#DC2626'
          }}>
            {subscriber.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          fontSize: '0.875rem',
          color: 'var(--foreground-muted)',
          flexWrap: 'wrap'
        }}>
          {subscriber.name && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {subscriber.name}
            </span>
          )}
          {subscriber.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {formatPhoneDisplay(subscriber.phone)}
            </span>
          )}
          {subscriber.source && (
            <span style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: 'var(--background-secondary)',
              color: 'var(--foreground-muted)'
            }}>
              {subscriber.source}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(subscriber.created_at)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isDeleting ? (
          <>
            <button
              onClick={() => onDelete(subscriber.id)}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                borderRadius: '8px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                background: '#DC2626',
                color: 'white',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              {isLoading ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              onClick={() => setDeleteConfirmId(null)}
              style={{
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                borderRadius: '8px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                background: 'transparent',
                color: 'var(--foreground-muted)'
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setDeleteConfirmId(subscriber.id)}
            style={{
              padding: '8px 12px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #FEE2E2',
              cursor: 'pointer',
              background: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Delete subscriber"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
