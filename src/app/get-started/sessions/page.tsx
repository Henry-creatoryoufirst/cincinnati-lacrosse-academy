import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SessionsPage() {
  let sessions: Event[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('event_type', 'training')
      .eq('is_active', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(10)
    if (data) sessions = data
  } catch {
    // Supabase unavailable — show static schedule only
  }

  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(to bottom, #111827, #0a0a0b)', paddingTop: '64px', paddingBottom: '80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <Link
            href="/get-started"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8125rem', textDecoration: 'none', marginBottom: '32px' }}
          >
            ← Back to Get Started
          </Link>

          <div style={{ margin: '0 auto 24px', width: '48px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)' }} />

          <h1 style={{ marginBottom: '12px', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#ffffff' }}>
            Weekend Training
          </h1>

          <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            High-intensity skill development at The Barn
          </p>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 100px' }}>

        {/* Sessions */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '16px' }}>
            Sessions
          </h2>

          {sessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.map((session: Event) => (
                <div
                  key={session.id}
                  style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ background: '#0a0a0a', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {new Date(session.start_date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                      {new Date(session.start_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {' · '}
                      {new Date(session.start_date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                      {session.end_date && (
                        <>
                          {' – '}
                          {new Date(session.end_date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </>
                      )}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '6px' }}>
                    {session.title}
                  </h3>

                  {session.description && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '8px' }}>
                      {session.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '20px' }}>
                    <span>📍 {session.location || 'The Barn'}</span>
                    <span>👥 {session.current_participants || 0}/{session.max_participants} spots</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
                      ${session.price} <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: '#9ca3af' }}>/ session</span>
                    </p>
                    <Link
                      href={`/events/${session.id}/book`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 24px',
                        background: '#0a0a0a',
                        color: '#fff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        textDecoration: 'none',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '40px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '4px' }}>No sessions scheduled right now.</p>
              <p style={{ fontSize: '0.8125rem', color: '#d1d5db', margin: 0 }}>Check back soon for upcoming training dates.</p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '16px' }}>
            Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>
                Location
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                The Barn — Cincinnati, OH
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>
                Cost
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                $40 per session · Drop-in welcome
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>
                Schedule
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                Saturdays · 12:00 – 2:00 PM
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
