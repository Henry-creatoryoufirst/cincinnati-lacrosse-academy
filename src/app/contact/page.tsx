'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSuccess(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200 px-10 py-15 text-center max-w-[480px] w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="text-[1.75rem] font-bold text-[#0a0a0a] mb-3">
            Message Sent!
          </h2>
          <p className="text-base text-muted mb-8 leading-relaxed">
            Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-8 py-3.5 bg-white text-[#0a0a0a] text-[0.9375rem] font-semibold border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-[#111827] to-[#0a0a0b] px-6 pt-[140px] pb-20 text-center relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/35 text-[0.8125rem] no-underline mb-10 tracking-wide transition-colors duration-200 hover:text-white/80"
          >
            <span>&larr;</span> Back to Home
          </Link>

          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-7" />

          <h1 className="text-[clamp(2.25rem,4vw,3.25rem)] font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-white to-white/85 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>

          <p className="text-lg text-white/45 font-normal max-w-[440px] mx-auto">
            We&apos;d love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 pt-20 pb-30 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-12">

            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-8 tracking-tight">
                Get in Touch
              </h2>

              {/* Contact Items */}
              <div className="flex flex-col gap-7">
                {/* Text */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">TEXT</p>
                    <a
                      href="sms:+15134445199"
                      className="text-base text-[#0a0a0a] no-underline font-medium"
                    >
                      (513) 444-5199
                    </a>
                    <p className="text-[0.8125rem] text-gray-400 mt-1.5 leading-snug">
                      Text only — no calls please
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center no-underline transition-all duration-200 hover:bg-[#0a0a0a]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200 group-hover:stroke-white">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                      <path d="m10 15 5-3-5-3z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/cincinnati_lax_acdmy?igsh=OXBqeGs5cmtyNjdy&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center no-underline transition-all duration-200 hover:bg-[#0a0a0a]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200 group-hover:stroke-white">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>

                  {/* Podcast */}
                  <a
                    href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center no-underline transition-all duration-200 hover:bg-[#0a0a0a]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200 group-hover:stroke-white">
                      <path d="M6 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"/>
                      <circle cx="12" cy="11" r="3"/>
                      <path d="M12 14v4"/>
                      <path d="M10 18h4"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-200 p-9">
                <h2 className="text-[1.375rem] font-bold text-[#0a0a0a] mb-1.5 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-[0.9375rem] text-muted mb-7">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                  You can also text us directly at{' '}
                  <a href="sms:+15134445199" className="text-blue-600 no-underline font-medium">(513) 444-5199</a>.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-[#0a0a0a] outline-none transition-all duration-200 font-[inherit] focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-[#0a0a0a] outline-none transition-all duration-200 font-[inherit] focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(513) 444-5199"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-[#0a0a0a] outline-none transition-all duration-200 font-[inherit] focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-[#0a0a0a] outline-none transition-all duration-200 font-[inherit] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_14px_center] pr-10 cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white"
                      >
                        <option value="">Select a topic</option>
                        <option value="training">Weekend Training</option>
                        <option value="membership">Membership Inquiry</option>
                        <option value="strength">Strength Training</option>
                        <option value="remote">Remote Coaching</option>
                        <option value="private">Private Lessons</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-[#0a0a0a] outline-none transition-all duration-200 font-[inherit] resize-y min-h-[140px] focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 focus:bg-white"
                    />
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-6 py-4 text-white text-base font-semibold border-none rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.25)] ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 cursor-pointer hover:bg-blue-700 hover:-translate-y-px'
                    }`}
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
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 2-7 20-4-9-9-4z"/>
                          <path d="M22 2 11 13"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
