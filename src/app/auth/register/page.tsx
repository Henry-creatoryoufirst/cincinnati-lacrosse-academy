'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 46px',
    fontSize: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    background: '#f9fafb',
    color: '#0a0a0a',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit'
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#2563eb'
    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
    e.target.style.background = 'white'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#e5e7eb'
    e.target.style.boxShadow = 'none'
    e.target.style.background = '#f9fafb'
  }

  // Success State
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '12px' }}>
            Check Your Email
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}>
            We&apos;ve sent a confirmation link to <strong style={{ color: '#0a0a0a' }}>{email}</strong>. Please check your inbox and click the link to activate your account.
          </p>
          <Link
            href="/auth/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '14px 32px',
              background: 'white',
              color: '#0a0a0a',
              fontSize: '0.9375rem',
              fontWeight: 600,
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.background = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.background = 'white'
            }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              background: '#0a0a0a',
              borderRadius: '16px',
              marginBottom: '24px',
              textDecoration: 'none'
            }}
          >
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>CLA</span>
          </Link>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#0a0a0a',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            <span style={{ fontStyle: 'italic' }}>Join the Family</span>
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: 400
          }}>
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div style={{
                  padding: '14px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#dc2626',
                    margin: 0
                  }}>{error}</p>
                </div>
              )}

              {/* Full Name Input */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="fullName"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: '1px solid #d1d5db',
                      marginRight: '10px',
                      marginTop: '1px',
                      cursor: 'pointer',
                      accentColor: '#2563eb',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: isLoading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease, transform 0.2s ease',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = '#1d4ed8'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = '#2563eb'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div style={{
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '0.9375rem',
                color: '#6b7280',
                margin: 0
              }}>
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0a0a0a'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
