'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setMessage('You\'re in! We\'ll keep you posted.')
      setEmail('')
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-[400px]">
            <Link href="/" className="text-xl font-bold text-white no-underline">
              Cincinnati Lacrosse Academy
            </Link>
            <p className="mt-4 text-white/60">
              World-class lacrosse training in Cincinnati. Building complete players
              from youth to collegiate level.
            </p>
          </div>

          {/* Email Signup */}
          <div>
            <h4 className="footer-title">Stay in the Loop</h4>
            <p className="text-white/60 text-sm mb-4">
              Get updates on training sessions, camps, and events.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status !== 'idle' && status !== 'loading') setStatus('idle') }}
                className="flex-1 min-w-0 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2 rounded-md bg-white text-[#1A1A1A] text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'Sending...' : 'Sign Up'}
              </button>
            </form>
            {status === 'success' && (
              <p className="mt-2 text-sm text-green-400">{message}</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-400">{message}</p>
            )}
          </div>

          {/* External Links */}
          <div>
            <h4 className="footer-title">Connect</h4>
            <ul className="footer-links flex flex-wrap gap-6">
              <li><a href="https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186" target="_blank" rel="noopener noreferrer">Podcast</a></li>
              <li><a href="https://youprjct.com" target="_blank" rel="noopener noreferrer">You.Prjct App</a></li>
              <li><a href="https://www.instagram.com/cincinnati_lax_acdmy?igsh=OXBqeGs5cmtyNjdy&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cincinnati Lacrosse Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
