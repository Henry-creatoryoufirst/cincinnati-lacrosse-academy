'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false)
    // Small delay to allow menu to close
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }, [])

  const handleLinkClick = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <header className="nav">
        <div className="nav-container">
          {/* Wordmark */}
          <Link href="/" className="nav-logo flex items-baseline gap-2.5 no-underline z-[60]">
            <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white">Cincinnati Lacrosse Academy</span>
            <span className="nav-tagline text-[0.6875rem] font-normal text-white/50 tracking-[0.02em]">A Schertzinger Company</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user ? (
              <Link
                href="/dashboard"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
              >
                Account
              </Link>
            ) : (
              <Link
                href="/auth/login"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/#schedule"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 20px',
                background: '#fff',
                color: '#0a0a0a',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-button hidden flex-col justify-center items-center w-11 h-11 bg-transparent border-none cursor-pointer p-2.5 z-[60] relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span
              className="block w-[22px] h-0.5 bg-white rounded-[2px] transition-all duration-300"
              style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}
            />
            <span
              className="block w-[22px] h-0.5 bg-white rounded-[2px] my-[5px] transition-opacity duration-300"
              style={{ opacity: mobileMenuOpen ? 0 : 1 }}
            />
            <span
              className="block w-[22px] h-0.5 bg-white rounded-[2px] transition-all duration-300"
              style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="mobile-menu-overlay fixed inset-0 bg-[#0a0a0b] z-50 flex flex-col justify-center items-center p-6 transition-all duration-300"
        style={{ opacity: mobileMenuOpen ? 1 : 0, visibility: mobileMenuOpen ? 'visible' : 'hidden' }}
      >
        {/* Close area at top for tapping outside links */}
        <div
          className="absolute top-0 left-0 right-0 h-[100px]"
          onClick={() => setMobileMenuOpen(false)}
        />

        <nav
          className="flex flex-col items-center gap-2 transition-transform duration-300 delay-100"
          style={{ transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)' }}
        >
          {/* Home */}
          <Link
            href="/"
            onClick={handleLinkClick}
            className="text-2xl font-medium text-white no-underline px-8 py-4 transition-colors duration-200 hover:text-white/70"
          >
            Home
          </Link>

          {/* Programs - scroll on homepage */}
          {pathname === '/' ? (
            <button
              onClick={() => scrollToSection('programs')}
              className="text-2xl font-medium text-white/70 bg-transparent border-none px-8 py-4 cursor-pointer transition-colors duration-200 hover:text-white"
            >
              Programs
            </button>
          ) : (
            <Link
              href="/#schedule"
              onClick={handleLinkClick}
              className="text-2xl font-medium text-white/70 no-underline px-8 py-4 transition-colors duration-200 hover:text-white"
            >
              Programs
            </Link>
          )}

          {/* Testimonials - scroll on homepage */}
          {pathname === '/' ? (
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-2xl font-medium text-white/70 bg-transparent border-none px-8 py-4 cursor-pointer transition-colors duration-200 hover:text-white"
            >
              Testimonials
            </button>
          ) : (
            <Link
              href="/#testimonials"
              onClick={handleLinkClick}
              className="text-2xl font-medium text-white/70 no-underline px-8 py-4 transition-colors duration-200 hover:text-white"
            >
              Testimonials
            </Link>
          )}

          {/* Beyond the Academy - scroll on homepage */}
          {pathname === '/' ? (
            <button
              onClick={() => scrollToSection('beyond')}
              className="text-2xl font-medium text-white/70 bg-transparent border-none px-8 py-4 cursor-pointer transition-colors duration-200 hover:text-white"
            >
              Beyond the Academy
            </button>
          ) : (
            <Link
              href="/#beyond"
              onClick={handleLinkClick}
              className="text-2xl font-medium text-white/70 no-underline px-8 py-4 transition-colors duration-200 hover:text-white"
            >
              Beyond the Academy
            </Link>
          )}

          {/* Divider */}
          <div className="w-[60px] h-px bg-white/15 my-4" />

          {/* Sign In / Account */}
          {user ? (
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="text-xl font-medium text-white/70 no-underline px-8 py-3 transition-colors duration-200 hover:text-white"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/auth/login"
              onClick={handleLinkClick}
              className="text-xl font-medium text-white/70 no-underline px-8 py-3 transition-colors duration-200 hover:text-white"
            >
              Sign In
            </Link>
          )}

          {/* Get Started CTA */}
          <Link
            href="/#schedule"
            onClick={handleLinkClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 36px',
              marginTop: '16px',
              background: '#fff',
              color: '#0a0a0a',
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </>
  )
}
