'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

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
      className="bg-[#111827] py-20 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative z-[1]">
        {/* Section label */}
        <div className="text-center mb-8">
          <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-primary">Testimonials</span>
        </div>

        {/* Testimonial carousel */}
        <div className="relative max-w-[900px] mx-auto min-h-[280px]">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="text-center transition-[opacity,transform] duration-[600ms] ease-in-out"
              style={{
                position: index === activeIndex ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: index === activeIndex ? 1 : 0,
                transform: index === activeIndex ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: index === activeIndex ? 'auto' : 'none'
              }}
            >
              {/* Large quotation mark */}
              <div className="text-[6rem] leading-none text-[rgba(37,99,235,0.15)] font-[Georgia,serif] -mb-8 select-none">
                &ldquo;
              </div>

              {/* Quote */}
              <blockquote className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-normal text-white leading-[1.6] tracking-[-0.01em] mb-6 not-italic">
                {testimonial.quote}
              </blockquote>

              {/* Attribution */}
              <p className="text-base font-medium text-white/60">
                — {testimonial.attribution}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-7">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className="h-2 rounded-full border-none cursor-pointer transition-all duration-[400ms] ease-in-out p-0"
              style={{
                width: index === activeIndex ? '32px' : '8px',
                background: index === activeIndex ? '#2563EB' : 'rgba(255, 255, 255, 0.3)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
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
          <div className="max-w-[640px] pt-[120px] pb-20">
            {/* Credential Badge - understated, earned */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block text-white/70 text-xs font-medium tracking-[0.15em] uppercase mb-7"
            >
              50+ College Commits
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.75rem,6vw,4rem)] font-bold tracking-[-0.025em] leading-[1.1] mb-6"
              style={{
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0,0,0,0.3)'
              }}
            >
              Where Leaders<br />Are Formed
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1rem,2vw,1.125rem)] font-normal leading-[1.7] mb-10 max-w-[540px]"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              World-class coaching. Relentless standards. But more importantly, young people who become confident, disciplined, and capable of carrying responsibility in sport and in life.
            </motion.p>

            {/* Single CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start gap-5"
            >
              <Link
                href="/get-started"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 36px',
                  background: '#ffffff',
                  color: '#0a0a0a',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                Get Started
              </Link>
              <a
                href="#programs"
                className="text-white/60 text-sm font-medium no-underline transition-all duration-200 inline-flex items-center gap-1.5 hover:text-white/90"
              >
                View Programs <span className="transition-transform duration-300">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Photo Grid */}
      <section className="section pb-12">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Our Community</span>
            <h2>More Than Training.<br />Join the Family.</h2>
            <p>
              The Cincinnati Lacrosse Academy isn&apos;t just a place to train. It&apos;s a culture.
              A community of athletes who show up daily, hold the line together, and raise the standard.
            </p>
          </div>

          {/* Photo Marquee - Two rows scrolling in opposite directions */}
          <div className="marquee mt-12">
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

      {/* Training Programs - Editorial Progression Layout */}
      <section id="programs" className="py-12 scroll-mt-20">
        <div className="container">
          {/* Section Header */}
          <div className="section-header">
            <span className="eyebrow">Programs</span>
            <h2>Training That Translates</h2>
            <p>
              From youth development to college prep, every program is built on the same standard.
              Intentional training that carries over to competition.
            </p>
          </div>

          {/* Program Progression */}
          <div className="mt-8">

            {/* 01 - Development: Weekend Training & Memberships */}
            <div className="program-item">
              <div className="program-row">
                <div className="program-image">
                  <Image
                    src="/images/community/dsc05410.jpg"
                    alt="Weekend training session"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <motion.div
                  className="program-content"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                >
                  <motion.div
                    className="flex items-baseline gap-4 mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="program-number">01</span>
                    <span className="program-label">Development</span>
                  </motion.div>
                  <h3 className="program-title">Weekend Training & Memberships</h3>
                  <p className="program-description">
                    Our weekend training sessions and summer membership programs. Consistent
                    development for players committed to improving their game.
                  </p>
                  <Link href="/get-started" className="program-link">View Schedule →</Link>
                </motion.div>
              </div>
            </div>

            {/* 02 - Strength Training */}
            <div className="program-item">
              <div className="program-row program-row--reverse">
                <div className="program-image">
                  <Image
                    src="/images/homepage-brett.jpg"
                    alt="Strength training with Brett"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <motion.div
                  className="program-content"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                >
                  <motion.div
                    className="flex items-baseline gap-4 mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="program-number">02</span>
                    <span className="program-label">Strength</span>
                  </motion.div>
                  <h3 className="program-title">Strength Training</h3>
                  <p className="program-description">
                    Programming designed to build complete athletes—strong, explosive,
                    and dynamic. Train like the best to compete with the best.
                  </p>
                  <Link href="/get-started" className="program-link">Train with Valiant →</Link>
                </motion.div>
              </div>
            </div>

            {/* 03 - Remote Assistance */}
            <div className="program-item">
              <div className="program-row">
                <div className="program-image">
                  <Image
                    src="/images/remote-training-card.jpg"
                    alt="Remote training assistance"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <motion.div
                  className="program-content"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                >
                  <motion.div
                    className="flex items-baseline gap-4 mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="program-number">03</span>
                    <span className="program-label">Remote</span>
                  </motion.div>
                  <h3 className="program-title">Remote Assistance</h3>
                  <p className="program-description">
                    Helping players across the country develop—especially those without access
                    to knowledgeable programs. Film analysis, training advice, and guidance
                    to elevate your game from anywhere.
                  </p>
                  <Link href="/get-started" className="program-link">Get Started →</Link>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials - Cinematic */}
      <div id="testimonials" className="scroll-mt-20">
        <TestimonialsSection />
      </div>

      {/* Beyond the Academy - Immersive Dark Section */}
      <section id="beyond" className="bg-[#0a0a0b] pt-[100px] pb-[120px] relative overflow-hidden scroll-mt-20">
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="container relative z-[1]">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-white/40 mb-4 block">Other Schertzinger Missions</span>
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-semibold text-white tracking-[-0.02em]">Beyond the Academy</h2>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* YouTube Card */}
            <div className="beyond-card bg-[#141416] rounded-[20px] overflow-hidden flex flex-col min-h-[420px] cursor-pointer transition-[transform,box-shadow] duration-300 ease-in-out">
              {/* Image - extends 70-75% of card */}
              <div className="relative h-[310px] overflow-hidden">
                <Image
                  src="/images/youtube-banner.jpg"
                  alt="Cincinnati Lacrosse YouTube"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
                {/* Gradient fade - gradual cinematic blend */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(20,20,22,0.4) 65%, rgba(20,20,22,0.8) 80%, #141416 100%)'
                  }}
                />
              </div>

              {/* Content - anchored to bottom */}
              <div className="p-6 flex-1 flex flex-col justify-end">
                <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3">YouTube</span>
                <h3 className="text-[1.375rem] font-semibold text-white mb-2.5 tracking-[-0.01em]">Follow the Story</h3>
                <p className="text-white/50 leading-[1.6] text-[0.9375rem] mb-5">
                  Behind the scenes, training content, and the journey of building something special.
                </p>
                <a
                  href="https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-400 no-underline inline-flex items-center gap-1.5"
                >
                  Watch Now <span className="transition-transform duration-200">→</span>
                </a>
              </div>
            </div>

            {/* You.Prjct Card - Featured/Larger */}
            <div
              className="beyond-card bg-black rounded-[20px] overflow-hidden flex flex-col min-h-[420px] relative cursor-pointer shadow-[0_0_100px_15px_rgba(59,130,246,0.2),0_0_60px_8px_rgba(139,92,246,0.15),0_0_160px_30px_rgba(59,130,246,0.1)]"
            >
              {/* Prominent glow effect with subtle pulse */}
              <div
                className="glow-pulse absolute top-[15%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] blur-[60px] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)'
                }}
              />

              {/* Phone mockup */}
              <div className="relative h-[260px] flex justify-center items-start pt-6" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
                <Image
                  src="/images/youprjct-phone.png"
                  alt="You.Prjct app"
                  width={200}
                  height={400}
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Content - anchored to bottom */}
              <div className="px-7 pb-7 pt-6 flex-1 flex flex-col justify-end relative z-[1]">
                <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-blue-400 mb-3">App</span>
                <h3 className="text-[1.375rem] font-semibold text-white mb-1.5 tracking-[-0.01em]">You.Prjct</h3>
                <p className="text-white/70 text-base mb-2">Order Your Life.</p>
                <p className="text-white/40 leading-[1.6] text-sm mb-5">
                  Build discipline, track progress, become who you&apos;re meant to be.
                </p>
                <a
                  href="https://youprjct.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-400 no-underline inline-flex items-center gap-1.5"
                >
                  Download Free <span>→</span>
                </a>
              </div>
            </div>

            {/* Podcast Card */}
            <div className="beyond-card bg-[#141416] rounded-[20px] overflow-hidden p-7 flex flex-col items-center min-h-[420px] cursor-pointer">
              {/* Podcast cover - hero element, centered and prominent */}
              <div className="w-[200px] h-[200px] rounded-[20px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.3)] mt-4 relative">
                <Image
                  src="/images/podcast-cover.png"
                  alt="The Infinite Game podcast"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>

              {/* Content - anchored to bottom, full width for left alignment */}
              <div className="mt-auto w-full text-left">
                <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3 block">Podcast</span>
                <h3 className="text-[1.375rem] font-semibold text-white mb-3 tracking-[-0.01em]">The Infinite Game</h3>
                <p className="text-white/50 leading-[1.7] text-sm italic mb-5">
                  To play the infinite game is to live as both masterpiece and work in progress, never finished, always invited further.
                </p>
                <a
                  href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-400 no-underline inline-flex items-center gap-1.5"
                >
                  Listen Now <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final photo strip */}
      <section className="p-0 overflow-hidden">
        <div className="grid grid-cols-6 gap-1">
          {[
            'dsc07755.jpg',
            'dsc01757.jpg',
            'dsc05410.jpg',
            'dsc06199.jpg',
            'dsc00046-2.jpg',
            'dsc01692-3.jpg'
          ].map((photo, index) => (
            <div key={index} className="relative h-[200px]">
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

      {/* Final CTA */}
      <section className="section">
        <div className="container text-center">
          <h2>Start Your Journey</h2>
          <p className="text-xl max-w-[560px] mx-auto mt-4 mb-10">
            Join hundreds of athletes who are taking their game to the next level
            with Cincinnati Lacrosse Academy.
          </p>
          <Link
            href="/get-started"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 36px',
              background: '#1A1A1A',
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: '9999px',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Get Started
          </Link>
        </div>
      </section>

    </main>
  )
}
