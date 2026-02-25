import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SessionsPage() {
  // Fetch upcoming training sessions from Supabase
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
      <section style={{ padding: '80px 0 60px', background: 'white' }}>
        <div className="container">
          <Link
            href="/get-started"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--foreground-muted)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              marginBottom: '32px'
            }}
          >
            <span>←</span> Back to Get Started
          </Link>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            marginBottom: '16px'
          }}>
            Weekend Training Sessions
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--foreground-muted)',
            maxWidth: '500px'
          }}>
            High-intensity skill development at The Barn
          </p>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section style={{ padding: '60px 0 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            Weekly Schedule
          </h2>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            {/* Saturday Session */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '24px',
              alignItems: 'center',
              padding: '28px 32px',
              borderLeft: '4px solid #2563eb'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Saturday
                  </span>
                  <span style={{
                    color: 'var(--foreground)',
                    fontSize: '0.9375rem',
                    fontWeight: 600
                  }}>
                    12:00 PM – 2:00 PM
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  marginBottom: '6px'
                }}>
                  Weekend Training Session
                </h3>
                <p style={{
                  color: 'var(--foreground-muted)',
                  fontSize: '0.875rem'
                }}>
                  Stick work, shooting, ground balls, game IQ, and live play. All skill levels welcome.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  $40
                </p>
                <Link
                  href={sessions.length > 0 ? `/events/${sessions[0].id}/book` : '/events'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 24px',
                    background: 'var(--foreground)',
                    color: 'white',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Sessions from Database */}
      {sessions.length > 0 && (
        <section style={{ padding: '48px 0 0' }}>
          <div className="container">
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}>
              Upcoming Sessions
            </h2>

            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {sessions.map((session: Event) => (
                <div
                  key={session.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px 32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '24px',
                    alignItems: 'center',
                    borderLeft: '4px solid #2563eb'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {new Date(session.start_date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span style={{
                        color: 'var(--foreground)',
                        fontSize: '0.9375rem',
                        fontWeight: 600
                      }}>
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
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      marginBottom: '6px'
                    }}>
                      {session.title}
                    </h3>
                    {session.description && (
                      <p style={{
                        color: 'var(--foreground-muted)',
                        fontSize: '0.875rem',
                        marginBottom: '8px'
                      }}>
                        {session.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '0.8125rem',
                      color: 'var(--foreground-muted)'
                    }}>
                      <span>📍 {session.location || 'The Barn'}</span>
                      <span>👥 {session.current_participants || 0}/{session.max_participants} spots</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '12px'
                    }}>
                      ${session.price}
                    </p>
                    <Link
                      href={`/events/${session.id}/book`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 24px',
                        background: 'var(--foreground)',
                        color: 'white',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        borderRadius: '10px',
                        textDecoration: 'none',
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Cards */}
      <section style={{ padding: '48px 0 100px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                📍 Location
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
                The Barn — Cincinnati, OH
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                💰 Session Cost
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
                $40 per session · Drop-in welcome
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                🕐 Schedule
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
                Saturdays · 12:00 PM – 2:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
