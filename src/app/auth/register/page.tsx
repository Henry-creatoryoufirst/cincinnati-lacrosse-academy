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

  // Success State
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200 px-10 py-[60px] text-center max-w-[480px] w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="text-[1.75rem] font-bold text-gray-950 mb-3">
            Check Your Email
          </h2>
          <p className="text-base text-gray-500 mb-8 leading-relaxed">
            We&apos;ve sent a confirmation link to <strong className="text-gray-950">{email}</strong>. Please check your inbox and click the link to activate your account.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 px-8 py-3.5 bg-white text-gray-950 text-[0.9375rem] font-semibold border-2 border-gray-200 rounded-xl no-underline transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-[420px]">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-14 h-14 bg-gray-950 rounded-2xl mb-6 no-underline"
          >
            <span className="text-white font-bold text-xl">CLA</span>
          </Link>

          <h1 className="text-[2rem] font-bold text-gray-950 mb-2 tracking-tight">
            <span className="italic">Join the Family</span>
          </h1>

          <p className="text-base text-gray-500 font-normal">
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl mb-6">
                  <p className="text-sm text-red-600 m-0">{error}</p>
                </div>
              )}

              {/* Full Name Input */}
              <div className="mb-5">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
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
                    className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white font-[inherit]"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
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
                    className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white font-[inherit]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
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
                    className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white font-[inherit]"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
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
                    className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white font-[inherit]"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mb-7">
                <label className="flex items-start cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-[18px] h-[18px] rounded-[5px] border border-gray-300 mr-2.5 mt-px cursor-pointer accent-blue-600 shrink-0"
                  />
                  <span className="text-[0.8125rem] text-gray-500 leading-normal">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 no-underline font-medium hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 no-underline font-medium hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-blue-600 text-white text-base font-semibold rounded-xl transition-all hover:bg-blue-700 hover:-translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
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
            <div className="mt-7 pt-6 border-t border-gray-200 text-center">
              <p className="text-[0.9375rem] text-gray-500 m-0">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-600 no-underline font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 no-underline transition-colors hover:text-gray-950"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
