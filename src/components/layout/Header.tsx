'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
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

  return (
    <header className="nav">
      <div className="nav-container">
        {/* Wordmark */}
        <Link href="/" className="nav-logo" style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <span style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'white'
          }}>Cincinnati Lacrosse Academy</span>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.02em'
          }}>A Schertzinger Company</span>
        </Link>

        {/* Right side: Sign In + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
      </div>
    </header>
  )
}
