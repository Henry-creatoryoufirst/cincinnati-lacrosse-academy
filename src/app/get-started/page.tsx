'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

// Session type for future Supabase integration
type Session = {
  id: string
  date: string
  time: string
  location: string
  spotsAvailable: number
}

// Placeholder for future sessions - will be fetched from Supabase
const upcomingSessions: Session[] = []

export default function GetStartedPage() {
  const [showBrettContact, setShowBrettContact] = useState(false)

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <Image
            src="/images/community/dsc05410.jpg"
            alt="Training at The Barn"
            fill
            sizes="100vw"
            quality={85}
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
          />
          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 100%)'
          }} />
        </div>

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '140px', paddingBottom: '80px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              marginBottom: '32px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          >
            <span>←</span> Back to Home
          </Link>

          <h1 style={{
            color: 'white',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            lineHeight: 1.1
          }}>
            Get Started
          </h1>
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 400,
            maxWidth: '460px'
          }}>
            Choose how you want to train with us
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section style={{
        padding: '80px 0 120px',
        background: 'linear-gradient(to bottom, #f8fafc 0%, white 100%)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px'
          }}>

            {/* Card 1: Weekend Training */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/images/community/dsc00511.jpg"
                  alt="Weekend training session"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={80}
                  style={{ objectFit: 'cover' }}
                />
                {/* Gradient fade to white */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.5) 70%, white 100%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Content */}
              <div style={{
                padding: '24px 28px 32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  color: '#0a0a0a'
                }}>
                  Weekend Training
                </h2>

                <p style={{
                  color: '#6b7280',
                  lineHeight: 1.65,
                  fontSize: '0.9375rem',
                  marginBottom: '24px'
                }}>
                  Join our weekend sessions at The Barn. High-intensity skill development with world-class coaching.
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '2.25rem',
                    fontWeight: 700,
                    color: '#0a0a0a',
                    letterSpacing: '-0.02em'
                  }}>$40</span>
                  <span style={{
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: '#9ca3af',
                    marginLeft: '6px'
                  }}>per session</span>
                </div>

                {upcomingSessions.length > 0 && (
                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#16a34a',
                    marginBottom: '20px',
                    fontWeight: 500
                  }}>
                    {upcomingSessions.length} session{upcomingSessions.length !== 1 ? 's' : ''} available
                  </p>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href="/get-started/sessions"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '16px 24px',
                      background: '#2563EB',
                      color: 'white',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#2563EB'}
                  >
                    View Sessions
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Strength Training */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/images/community/dsc00033.jpg"
                  alt="Strength training"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={80}
                  style={{ objectFit: 'cover' }}
                />
                {/* Gradient fade to white */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.5) 70%, white 100%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Content */}
              <div style={{
                padding: '24px 28px 32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#dc2626'
                  }}>with Valiant Strength</span>
                </div>

                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  color: '#0a0a0a'
                }}>
                  Strength Training
                </h2>

                <p style={{
                  color: '#6b7280',
                  lineHeight: 1.65,
                  fontSize: '0.9375rem',
                  marginBottom: '24px'
                }}>
                  Train with Brett. Programming designed to build complete athletes—strong, explosive, and dynamic.
                </p>

                {showBrettContact && (
                  <div style={{
                    background: '#fef2f2',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '6px' }}>
                      Call or text Brett:
                    </p>
                    <a
                      href="tel:+15135551234"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#0a0a0a',
                        textDecoration: 'none'
                      }}
                    >
                      (513) 555-1234
                    </a>
                  </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={() => setShowBrettContact(!showBrettContact)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '16px 24px',
                      background: showBrettContact ? '#fee2e2' : 'white',
                      color: showBrettContact ? '#dc2626' : '#0a0a0a',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      border: '2px solid',
                      borderColor: showBrettContact ? '#fecaca' : '#e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!showBrettContact) {
                        e.currentTarget.style.borderColor = '#d1d5db'
                        e.currentTarget.style.background = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showBrettContact) {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    {showBrettContact ? 'Hide Contact Info' : 'Get in Touch'}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Remote Training */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/images/community/dww03060.jpg"
                  alt="Remote lacrosse training"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={80}
                  style={{ objectFit: 'cover' }}
                />
                {/* Gradient fade to white */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.5) 70%, white 100%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Content */}
              <div style={{
                padding: '24px 28px 32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#7c3aed'
                  }}>with Henry & Harrison</span>
                </div>

                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  color: '#0a0a0a'
                }}>
                  Remote Lacrosse Training
                </h2>

                <p style={{
                  color: '#6b7280',
                  lineHeight: 1.65,
                  fontSize: '0.9375rem',
                  marginBottom: '16px'
                }}>
                  Work one-on-one to increase skill, training plans, and IQ. Film breakdown, wall ball, shooting, and dodging advice. Whatever it takes to help you pursue your dream.
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f3f4f6',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  alignSelf: 'flex-start'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#4b5563'
                  }}>Personalized 1-on-1 coaching</span>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href="/contact?subject=remote-training"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '16px 24px',
                      background: '#2563EB',
                      color: 'white',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#2563EB'}
                  >
                    Start Training
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Help Section */}
          <div style={{
            marginTop: '64px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.9375rem',
              marginBottom: '6px'
            }}>
              Not sure which option is right for you?
            </p>
            <Link
              href="/contact"
              style={{
                color: '#2563EB',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'gap 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
              onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
            >
              Reach out and we'll help you decide <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
