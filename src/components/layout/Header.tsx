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
          <Link href="/" className="nav-logo" style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            textDecoration: 'none',
            zIndex: 60
          }}>
            <span style={{
              fontSize: '1.0625rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'white'
            }}>Cincinnati Lacrosse Academy</span>
            <span className="nav-tagline" style={{
              fontSize: '0.6875rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.02em'
            }}>A Schertzinger Company</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {user ? (
              <Link
                href="/dashboard"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
              >
                Account
              </Link>
            ) : (
              <Link
                href="/auth/login"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/get-started"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                background: 'white',
                color: '#0a0a0a',
                fontSize: '0.8125rem',
                fontWeight: 600,
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            style={{
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '44px',
              height: '44px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              zIndex: 60,
              position: 'relative'
            }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'white',
                borderRadius: '2px',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'white',
                borderRadius: '2px',
                margin: '5px 0',
                transition: 'opacity 0.3s ease',
                opacity: mobileMenuOpen ? 0 : 1
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'white',
                borderRadius: '2px',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="mobile-menu-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0a0b',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          padding: '24px'
        }}
      >
        {/* Close area at top for tapping outside links */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px'
          }}
          onClick={() => setMobileMenuOpen(false)}
        />

        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 0.3s ease 0.1s'
        }}>
          {/* Home */}
          <Link
            href="/"
            onClick={handleLinkClick}
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: 'white',
              textDecoration: 'none',
              padding: '16px 32px',
              transition: 'color 0.2s ease'
            }}
          >
            Home
          </Link>

          {/* Programs - scroll on homepage */}
          {pathname === '/' ? (
            <button
              onClick={() => scrollToSection('programs')}
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                background: 'none',
                border: 'none',
                padding: '16px 32px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
            >
              Programs
            </button>
          ) : (
            <Link
              href="/#programs"
              onClick={handleLinkClick}
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '16px 32px',
                transition: 'color 0.2s ease'
              }}
            >
              Programs
            </Link>
          )}

          {/* Testimonials - scroll on homepage */}
          {pathname === '/' ? (
            <button
              onClick={() => scrollToSection('testimonials')}
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                background: 'none',
                border: 'none',
                padding: '16px 32px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
            >
              Testimonials
            </button>
          ) : (
            <Link
              href="/#testimonials"
              onClick={handleLinkClick}
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '16px 32px',
                transition: 'color 0.2s ease'
              }}
            >
              Testimonials
            </Link>
          )}

          {/* Beyond the Academy - scroll on homepage */}
          {pathname === '/' ? (
            <button
              onClick={() => scrollToSection('beyond')}
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                background: 'none',
                border: 'none',
                padding: '16px 32px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
            >
              Beyond the Academy
            </button>
          ) : (
            <Link
              href="/#beyond"
              onClick={handleLinkClick}
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '16px 32px',
                transition: 'color 0.2s ease'
              }}
            >
              Beyond the Academy
            </Link>
          )}

          {/* Divider */}
          <div style={{
            width: '60px',
            height: '1px',
            background: 'rgba(255,255,255,0.15)',
            margin: '16px 0'
          }} />

          {/* Sign In / Account */}
          {user ? (
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '12px 32px',
                transition: 'color 0.2s ease'
              }}
            >
              Account
            </Link>
          ) : (
            <Link
              href="/auth/login"
              onClick={handleLinkClick}
              style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '12px 32px',
                transition: 'color 0.2s ease'
              }}
            >
              Sign In
            </Link>
          )}

          {/* Get Started CTA */}
          <Link
            href="/get-started"
            onClick={handleLinkClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 40px',
              marginTop: '16px',
              background: 'white',
              color: '#0a0a0a',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '9999px',
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </>
  )
}
