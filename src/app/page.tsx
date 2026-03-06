'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, FormEvent } from 'react'
import { motion } from 'framer-motion'
import WeeklyCalendarBar from '@/components/home/WeeklyCalendarBar'

/**
 * Community photos split into two distinct sets for the marquee rows.
 * No photos overlap between rows - each row shows unique content.
 * Alt text describes the photo for accessibility.
 */
const ROW_1_PHOTOS = [
  { file: 'dsc07755.jpg', alt: 'Team celebration moment' },
  { file: 'dsc05410.jpg', alt: 'Athletes training together' },
  { file: 'dsc01757.jpg', alt: 'Team photo on the field' },
  { file: 'dsc06199.jpg', alt: 'Summer camp group' },
  { file: 'dsc00033.jpg', alt: 'Strength training session' },
  { file: 'dsc00511.jpg', alt: 'Indoor facility workout' },
  { file: 'dww03060.jpg', alt: 'Full academy gathering' },
  { file: 'dsc09217.jpg', alt: 'Training in all conditions' },
  { file: 'dsc00043.jpg', alt: 'Morning conditioning' },
  { file: 'dsc00516.jpg', alt: 'Team bonding moment' },
  { file: 'dsc01699.jpg', alt: 'Players on the field' },
  { file: 'dsc01769.jpg', alt: 'Practice session' },
  { file: 'dsc02564.jpg', alt: 'Summer training day' },
  { file: 'dsc04808.jpg', alt: 'Athletes in action' },
  { file: 'dsc05162.jpg', alt: 'Winter training session' },
  { file: 'dsc05701.jpg', alt: 'Team huddle' },
  { file: 'dsc08153.jpg', alt: 'Fall practice' },
  { file: 'dsc08388.jpg', alt: 'Conditioning drills' },
  { file: 'dsc08615.jpg', alt: 'Training partners' },
  { file: 'dsc08935.jpg', alt: 'End of practice' },
  { file: 'dsc09167.jpg', alt: 'Summer camp moment' },
  { file: 'dsc09261.jpg', alt: 'Team building' },
  { file: 'dsc09464.jpg', alt: 'Post-workout' },
  { file: 'dsc09683.jpg', alt: 'Evening session' },
  { file: 'dsc09733.jpg', alt: 'Athletes resting' },
  { file: '10e2a166-1c7e-4077-a492-809227f008c2.jpg', alt: 'Community moment' },
  { file: 'adfe2026-9ec9-4047-af00-e9377d61a42b.jpg', alt: 'Team photo' },
  { file: 'u-school-vs-licking-valley-224.jpeg', alt: 'Game day action' },
  { file: 'img8226.jpg', alt: 'Behind the scenes' },
] as const

const ROW_2_PHOTOS = [
  { file: 'dsc00022-2.jpg', alt: 'Early morning training' },
  { file: 'dsc00046-2.jpg', alt: 'Workout session' },
  { file: 'dsc00059.jpg', alt: 'Team preparation' },
  { file: 'dsc00237-3.jpg', alt: 'Practice drills' },
  { file: 'dsc00370.jpg', alt: 'Winter conditioning' },
  { file: 'dsc00415.jpg', alt: 'Athletes focused' },
  { file: 'dsc00503.jpg', alt: 'Training moment' },
  { file: 'dsc01657-4.jpg', alt: 'Team gathering' },
  { file: 'dsc01692-3.jpg', alt: 'Outdoor session' },
  { file: 'dsc01718-2.jpg', alt: 'Group training' },
  { file: 'dsc01747-3.jpg', alt: 'Practice field' },
  { file: 'dsc01760-2.jpg', alt: 'Team bonding' },
  { file: 'dsc01773-2.jpg', alt: 'Athletes together' },
  { file: 'dsc03812.jpg', alt: 'Fall training' },
  { file: 'dsc04861.jpg', alt: 'December session' },
  { file: 'dsc05481.jpg', alt: 'New year training' },
  { file: 'dsc07788.jpg', alt: 'October practice' },
  { file: 'dsc08341.jpg', alt: 'Summer workout' },
  { file: 'dsc08603.jpg', alt: 'Team effort' },
  { file: 'dsc08756.jpg', alt: 'Halloween training' },
  { file: 'dsc09021.jpg', alt: 'Morning session' },
  { file: 'dsc09175.jpg', alt: 'Camp activities' },
  { file: 'dsc09178.jpg', alt: 'Summer fun' },
  { file: 'dsc09428.jpg', alt: 'November training' },
  { file: 'dsc09538.jpg', alt: 'Athletes working' },
  { file: 'dsc09720.jpg', alt: 'Late fall session' },
  { file: 'dsc09759.jpg', alt: 'Team spirit' },
  { file: '8746a0bd-0b75-4a2b-8754-edb89f150fe1.jpg', alt: 'Community event' },
  { file: 'u-school-vs-licking-valley-226.jpeg', alt: 'Game action shot' },
] as const

/**
 * Testimonials data - Real quotes from our community
 */
const TESTIMONIALS = [
  {
    quote: "This is my daughter's first summer with the Cincinnati Lacrosse Academy and I have seen noticeable changes in just 3 weeks. With her confidence, strength and speed. I had multiple parents approach me at this weekend's club lax tournament to comment on this. Most of these parents have known her for YEARS and made these comments after 3 weeks of CLA training.",
    attribution: "Academy Parent"
  },
  {
    quote: "Before I started at the Academy I was very close to quitting lacrosse entirely because it stopped feeling fun and more like a chore. Although, after the first day I completely changed my mind and fell in love with the sport again. Going to training is probably the best part of my day, and the people/community is amazing.",
    attribution: "Academy Athlete"
  },
  {
    quote: "The Academy has literally changed my life forever. The coaching and friendships I have made here will stay with me for a lifetime. I learned to be a better lacrosse player, but more importantly a better man.",
    attribution: "Academy Athlete"
  }
] as const

/**
 * Cinematic testimonials section with auto-advancing carousel
 */
function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance every 7 seconds unless paused
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [isPaused])

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  return (
    <section
      style={{
        background: '#111827',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#60A5FA',
            }}
          >
            Testimonials
          </span>
        </div>

        {/* Testimonial carousel */}
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', minHeight: '280px' }}>
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                transition: 'opacity 600ms ease-in-out, transform 600ms ease-in-out',
                position: index === activeIndex ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: index === activeIndex ? 1 : 0,
                transform: index === activeIndex ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: index === activeIndex ? 'auto' : 'none',
              }}
            >
              {/* Large quotation mark */}
              <div
                style={{
                  fontSize: '6rem',
                  lineHeight: 1,
                  color: 'rgba(37,99,235,0.15)',
                  fontFamily: 'Georgia, serif',
                  marginBottom: '-32px',
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1.6,
                  letterSpacing: '-0.01em',
                  marginBottom: '24px',
                  fontStyle: 'normal',
                }}
              >
                {testimonial.quote}
              </blockquote>

              {/* Attribution */}
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                — {testimonial.attribution}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px' }}>
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              style={{
                height: '8px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 400ms ease-in-out',
                width: index === activeIndex ? '32px' : '8px',
                background: index === activeIndex ? '#2563EB' : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [heroForm, setHeroForm] = useState({ email: '', phone: '' })
  const [heroStatus, setHeroStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [heroMessage, setHeroMessage] = useState('')

  function formatPhoneInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length === 0) return ''
    if (digits.length <= 3) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  async function handleHeroSubmit(e: FormEvent) {
    e.preventDefault()
    setHeroStatus('loading')
    setHeroMessage('')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: heroForm.email,
          phone: heroForm.phone ? heroForm.phone.replace(/\D/g, '') : undefined,
          source: 'hero_cta',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong.')
      }
      setHeroStatus('success')
      setHeroForm({ email: '', phone: '' })
    } catch (err: unknown) {
      setHeroStatus('error')
      setHeroMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const heroInputStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    width: '100%',
    backdropFilter: 'blur(8px)',
  }

  return (
    <main>
      {/* Hero Section — tightened: 85vh instead of min-h-screen */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background Photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community/top-banner.jpg"
            alt="Cincinnati Lacrosse Academy athletes"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* Refined gradient overlay - dark left, transparent right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.05) 100%)'
            }}
          />
          {/* Subtle vignette for cinematic depth */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_40px_rgba(0,0,0,0.3)]" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-[1]">
          <div style={{ maxWidth: '640px', paddingTop: '100px', paddingBottom: '60px' }}>
            {/* Credential Badge - understated, earned */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'inline-block',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '28px',
              }}
            >
              50+ College Commits
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(2.75rem, 6vw, 4rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: '24px',
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              }}
            >
              Where Leaders<br />Are Formed
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                fontWeight: 400,
                lineHeight: 1.7,
                marginBottom: '32px',
                maxWidth: '540px',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              World-class coaching. Relentless standards. But more importantly, young people who become confident, disciplined, and capable of carrying responsibility in sport and in life.
            </motion.p>

            {/* Inline Contact Collection Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxWidth: '480px' }}
            >
              {heroStatus === 'success' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9375rem', fontWeight: 500 }}>
                    You&apos;re in. We&apos;ll keep you posted.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleHeroSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={heroForm.email}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, email: e.target.value }))}
                      style={{ ...heroInputStyle, flex: 1 }}
                    />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Phone (optional)"
                      value={heroForm.phone}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, phone: formatPhoneInput(e.target.value) }))}
                      style={{ ...heroInputStyle, flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="submit"
                      disabled={heroStatus === 'loading'}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '9999px',
                        background: '#ffffff',
                        color: '#0a0a0a',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        border: 'none',
                        cursor: heroStatus === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: heroStatus === 'loading' ? 0.6 : 1,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {heroStatus === 'loading' ? 'Joining...' : 'Get Started'}
                    </button>
                    <a
                      href="#schedule"
                      style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View Schedule <span>&rarr;</span>
                    </a>
                  </div>
                  {heroStatus === 'error' && (
                    <p style={{ color: '#f87171', fontSize: '0.8125rem', marginTop: '2px' }}>{heroMessage}</p>
                  )}
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6875rem', marginTop: '2px' }}>
                    Get notified about sessions and events. No spam.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Photo Grid — tightened: reduced top padding */}
      <section style={{ padding: '48px 0 12px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '16px',
              }}
            >
              Our Community
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              More Than Training.<br />Join the Family.
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--foreground-secondary)', lineHeight: 1.7 }}>
              The Cincinnati Lacrosse Academy isn&apos;t just a place to train. It&apos;s a culture.
              A community of athletes who show up daily, hold the line together, and raise the standard.
            </p>
          </div>

          {/* Photo Marquee - Two rows scrolling in opposite directions */}
          <div className="marquee" style={{ marginTop: '32px' }}>
            {/* Row 1: Scrolls left */}
            <div className="marquee-row">
              <div className="marquee-track">
                {/* Photos duplicated for seamless infinite scroll */}
                {[...ROW_1_PHOTOS, ...ROW_1_PHOTOS].map((photo, index) => (
                  <div key={`row1-${index}`} className="marquee-photo">
                    <Image
                      src={`/images/community/${photo.file}`}
                      alt={photo.alt}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolls right (reversed) */}
            <div className="marquee-row">
              <div className="marquee-track marquee-track--reverse">
                {[...ROW_2_PHOTOS, ...ROW_2_PHOTOS].map((photo, index) => (
                  <div key={`row2-${index}`} className="marquee-photo">
                    <Image
                      src={`/images/community/${photo.file}`}
                      alt={photo.alt}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Training Schedule Calendar */}
      <div id="schedule" style={{ scrollMarginTop: '80px' }}>
        <WeeklyCalendarBar />
      </div>

      {/* Testimonials - Cinematic */}
      <div id="testimonials" className="scroll-mt-20">
        <TestimonialsSection />
      </div>

      {/* Beyond the Academy - Immersive Dark Section */}
      <section
        id="beyond"
        style={{
          background: '#0a0a0b',
          padding: '100px 0 120px',
          position: 'relative',
          overflow: 'hidden',
          scrollMarginTop: '80px',
        }}
      >
        {/* Subtle noise texture overlay */}
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
          {/* Section Header */}
          <motion.div
            style={{ textAlign: 'center', marginBottom: '64px' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}
            >
              Other Schertzinger Missions
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Beyond the Academy
            </h2>
          </motion.div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '32px',
            }}
            className="beyond-grid"
          >
            {/* YouTube Card */}
            <motion.a
              href="https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#141416',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '420px',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              whileHover={{ y: -6 }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '310px', overflow: 'hidden' }}>
                <Image
                  src="/images/youtube-banner.jpg"
                  alt="Cincinnati Lacrosse YouTube"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(20,20,22,0.4) 65%, rgba(20,20,22,0.8) 80%, #141416 100%)',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  YouTube
                </span>
                <h3
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Follow the Story
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.6,
                    fontSize: '0.9375rem',
                    marginBottom: '20px',
                  }}
                >
                  Behind the scenes, training content, and the journey of building something special.
                </p>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#60A5FA',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Watch Now <span>→</span>
                </span>
              </div>
            </motion.a>

            {/* You.Prjct Card */}
            <motion.a
              href="https://youprjct.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#000000',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '420px',
                position: 'relative',
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: '0 0 100px 15px rgba(59,130,246,0.2), 0 0 60px 8px rgba(139,92,246,0.15), 0 0 160px 30px rgba(59,130,246,0.1)',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              whileHover={{ y: -6 }}
            >
              {/* Glow effect */}
              <div
                className="glow-pulse"
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '320px',
                  height: '320px',
                  filter: 'blur(60px)',
                  pointerEvents: 'none',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
                }}
              />

              {/* Phone mockup */}
              <div
                style={{
                  position: 'relative',
                  height: '260px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingTop: '24px',
                  maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                }}
              >
                <Image
                  src="/images/youprjct-phone.png"
                  alt="You.Prjct app"
                  width={200}
                  height={400}
                  style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Content */}
              <div
                style={{
                  padding: '24px 28px 28px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#60A5FA',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  App
                </span>
                <h3
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '6px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  You.Prjct
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '8px' }}>
                  Order Your Life.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontSize: '0.875rem', marginBottom: '20px' }}>
                  Build discipline, track progress, become who you&apos;re meant to be.
                </p>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#60A5FA',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Download Free <span>→</span>
                </span>
              </div>
            </motion.a>

            {/* Podcast Card */}
            <motion.a
              href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#141416',
                borderRadius: '20px',
                overflow: 'hidden',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '420px',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              whileHover={{ y: -6 }}
            >
              {/* Podcast cover */}
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
                  marginTop: '16px',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/images/podcast-cover.png"
                  alt="The Infinite Game podcast"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div style={{ marginTop: 'auto', width: '100%', textAlign: 'left' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  Podcast
                </span>
                <h3
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '12px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  The Infinite Game
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.7,
                    fontSize: '0.875rem',
                    fontStyle: 'italic',
                    marginBottom: '20px',
                  }}
                >
                  To play the infinite game is to live as both masterpiece and work in progress, never finished, always invited further.
                </p>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#60A5FA',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Listen Now <span>→</span>
                </span>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Final photo strip */}
      <section style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px',
          }}
        >
          {[
            'dsc07755.jpg',
            'dsc01757.jpg',
            'dsc05410.jpg',
            'dsc06199.jpg',
            'dsc00046-2.jpg',
            'dsc01692-3.jpg'
          ].map((photo, index) => (
            <div key={index} style={{ position: 'relative', height: '200px' }}>
              <Image
                src={`/images/community/${photo}`}
                alt="Community moment"
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
