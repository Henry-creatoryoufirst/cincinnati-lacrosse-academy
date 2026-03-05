'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function GetStartedPage() {
  const [showBrettContact, setShowBrettContact] = useState(false)
  const [showRemoteContact, setShowRemoteContact] = useState(false)

  return (
    <main>
      {/* Hero Section - Triptych Layout */}
      <section className="triptych-header">
        {/* Left Image Panel */}
        <div className="triptych-header-left">
          <Image
            src="/images/get-started-header-1.jpg"
            alt="Athlete training"
            fill
            sizes="33vw"
            priority
            className="object-cover object-center"
          />
          {/* Subtle edge gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-[rgba(10,10,11,0.3)] to-transparent pointer-events-none" />
        </div>

        {/* Center Text Panel */}
        <div className="triptych-header-center bg-gradient-to-b from-[#111827] to-[#0a0a0b] relative">
          {/* Radial glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />

          {/* Edge lines */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/35 text-[0.8125rem] no-underline mb-12 transition-colors duration-200 tracking-[0.03em] hover:text-white/80"
            >
              <span>←</span> Back to Home
            </Link>
          </motion.div>

          {/* Decorative line above title */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-[48px] h-[2px] mb-7"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.25rem,4vw,3.25rem)] font-bold tracking-[-0.02em] mb-5 leading-[1.1]"
            style={{
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
            className="text-lg text-white/45 font-normal tracking-[0.04em] mb-8"
          >
            Three ways to train with us
          </motion.p>

          {/* Animated scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-5 flex items-center justify-center"
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
          <Image
            src="/images/get-started-header-2.jpg"
            alt="Athletes working hard"
            fill
            sizes="33vw"
            priority
            className="object-cover object-top"
          />
          {/* Subtle edge gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,10,11,0.3)] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Cards Section - Completely separate with solid white background */}
      <section className="get-started-cards">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

            {/* Card 1: Weekend Training */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <Image
                  src="/images/weekend-training-card.jpg"
                  alt="Weekend training session"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '6px' }}>
                  At The Barn
                </p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                  Weekend Training
                </h2>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#6b7280', marginBottom: '16px' }}>
                  High-intensity skill development with world-class coaching. Drop-in sessions every weekend.
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '0' }}>
                  $40 <span style={{ fontWeight: 400, color: '#9ca3af' }}>/ session</span>
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                  <Link
                    href="/get-started/sessions"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '11px 20px',
                      background: '#0a0a0a',
                      color: '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      border: 'none',
                    }}
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
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <Image
                  src="/images/strength-training-card.jpg"
                  alt="Strength training"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[50%_35%]"
                />
              </div>

              <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#dc2626', marginBottom: '6px' }}>
                  With Valiant Strength
                </p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                  Strength Training
                </h2>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#6b7280', marginBottom: '16px' }}>
                  Train with Brett. Programming designed to build complete athletes — strong, explosive, and dynamic.
                </p>

                {showBrettContact && (
                  <div style={{ background: '#fef2f2', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '4px' }}>
                      Call or text Brett:
                    </p>
                    <a href="tel:+19372321141" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a0a0a', textDecoration: 'none' }}>
                      (937) 232-1141
                    </a>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                  <button
                    onClick={() => setShowBrettContact(!showBrettContact)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '11px 20px',
                      background: showBrettContact ? '#fef2f2' : '#0a0a0a',
                      color: showBrettContact ? '#dc2626' : '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      borderRadius: '8px',
                      border: showBrettContact ? '1px solid #fecaca' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {showBrettContact ? 'Hide Contact' : 'Get in Touch'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Remote Training */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <Image
                  src="/images/remote-training-card.jpg"
                  alt="Remote lacrosse training"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '6px' }}>
                  With Henry &amp; Harrison
                </p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                  Remote Lacrosse Training
                </h2>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#6b7280', marginBottom: '16px' }}>
                  Personalized 1-on-1 coaching. Film breakdown, wall ball, shooting, and dodging advice to take your game to the next level.
                </p>

                {showRemoteContact && (
                  <div style={{ background: '#f5f3ff', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '4px' }}>
                      Call or text Henry &amp; Harrison:
                    </p>
                    <a href="tel:+15134445199" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a0a0a', textDecoration: 'none' }}>
                      (513) 444-5199
                    </a>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                  <button
                    onClick={() => setShowRemoteContact(!showRemoteContact)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '11px 20px',
                      background: showRemoteContact ? '#f5f3ff' : '#0a0a0a',
                      color: showRemoteContact ? '#7c3aed' : '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      borderRadius: '8px',
                      border: showRemoteContact ? '1px solid #ddd6fe' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {showRemoteContact ? 'Hide Contact' : 'Get in Touch'}
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
