'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
  const [showRemoteContact, setShowRemoteContact] = useState(false)

  return (
    <main>
      {/* Hero Section - Triptych Layout */}
      <section className="triptych-header">
        {/* Left Image Panel */}
        <div className="triptych-header-left">
          <img
            src="/images/get-started-header-1.jpg"
            alt="Athlete training"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Subtle edge gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to left, rgba(10,10,11,0.3) 0%, transparent 30%)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Center Text Panel */}
        <div className="triptych-header-center" style={{
          background: 'linear-gradient(180deg, #111827 0%, #0a0a0b 100%)',
          position: 'relative'
        }}>
          {/* Radial glow behind text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />

          {/* Edge lines */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.08) 50%, transparent 90%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.08) 50%, transparent 90%)',
            pointerEvents: 'none'
          }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.8125rem',
                textDecoration: 'none',
                marginBottom: '48px',
                transition: 'color 0.2s ease',
                letterSpacing: '0.03em'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              <span>←</span> Back to Home
            </Link>
          </motion.div>

          {/* Decorative line above title */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '48px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              marginBottom: '28px'
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              lineHeight: 1.1,
              background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 30px rgba(255,255,255,0.1)'
            }}
          >
            Your Journey<br />Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              marginBottom: '32px'
            }}
          >
            Three ways to train with us
          </motion.p>

          {/* Animated scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Image Panel */}
        <div className="triptych-header-right">
          <img
            src="/images/get-started-header-2.jpg"
            alt="Athletes working hard"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
          {/* Subtle edge gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(10,10,11,0.3) 0%, transparent 30%)',
            pointerEvents: 'none'
          }} />
        </div>
      </section>

      {/* Cards Section - Completely separate with solid white background */}
      <section className="get-started-cards">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px'
          }}>

            {/* Card 1: Weekend Training */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden'
              }}>
                <img
                  src="/images/weekend-training-card.jpg"
                  alt="Weekend training session"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
            </motion.div>

            {/* Card 2: Strength Training */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden'
              }}>
                <img
                  src="/images/strength-training-card.jpg"
                  alt="Strength training"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%' }}
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
                      href="tel:+19372321141"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#0a0a0a',
                        textDecoration: 'none'
                      }}
                    >
                      (937) 232-1141
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
            </motion.div>

            {/* Card 3: Remote Training */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden'
              }}>
                <img
                  src="/images/remote-training-card.jpg"
                  alt="Remote lacrosse training"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

                {showRemoteContact && (
                  <div style={{
                    background: '#f5f3ff',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '6px' }}>
                      Call or text Henry & Harrison:
                    </p>
                    <a
                      href="tel:+15134445199"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#0a0a0a',
                        textDecoration: 'none'
                      }}
                    >
                      (513) 444-5199
                    </a>
                  </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={() => setShowRemoteContact(!showRemoteContact)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '16px 24px',
                      background: showRemoteContact ? '#ede9fe' : 'white',
                      color: showRemoteContact ? '#7c3aed' : '#0a0a0a',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      border: '2px solid',
                      borderColor: showRemoteContact ? '#ddd6fe' : '#e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!showRemoteContact) {
                        e.currentTarget.style.borderColor = '#d1d5db'
                        e.currentTarget.style.background = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showRemoteContact) {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    {showRemoteContact ? 'Hide Contact Info' : 'Get in Touch'}
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  )
}
