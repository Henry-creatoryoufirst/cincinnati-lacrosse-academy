import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function SessionsPage() {
  const supabase = await createClient()

  // Fetch upcoming training sessions
  const { data: sessions } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'training')
    .eq('is_active', true)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(10)

  const hasUpcomingSessions = sessions && sessions.length > 0

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

      {/* Sessions List */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container">
          {hasUpcomingSessions ? (
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '24px',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {new Date(session.start_date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
                        {new Date(session.start_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      {session.title}
                    </h3>
                    <p style={{
                      color: 'var(--foreground-muted)',
                      fontSize: '0.9375rem',
                      marginBottom: '12px'
                    }}>
                      {session.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '0.875rem',
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
                    <a
                      href="https://forms.gle/KZzN9f5P1gBsmKqZ9"
                      target="_blank"
                      rel="noopener noreferrer"
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
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Coming Soon State */
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '64px 32px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                Sessions Coming Soon
              </h2>

              <p style={{
                color: 'var(--foreground-muted)',
                fontSize: '1rem',
                maxWidth: '400px',
                margin: '0 auto 32px',
                lineHeight: 1.6
              }}>
                We're preparing the spring schedule. Sign up to be notified when sessions are available.
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <a
                  href="https://forms.gle/KZzN9f5P1gBsmKqZ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 24px',
                    background: 'var(--foreground)',
                    color: 'white',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  Get Notified
                </a>
                <Link
                  href="/get-started"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 24px',
                    background: '#f1f5f9',
                    color: 'var(--foreground)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  View Other Options
                </Link>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginTop: '40px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                Location
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
                The Barn - Cincinnati, OH
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                Session Cost
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
                $40 per session
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                Typical Schedule
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9375rem' }}>
                Saturdays & Sundays
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
