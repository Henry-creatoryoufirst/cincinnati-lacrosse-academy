'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const plans = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for getting started with structured training',
    features: [
      '4 weekly training sessions/month',
      'You.Prjct app access',
      '10% off camps & clinics',
      'Monthly skills assessment',
      'Member community access',
    ],
    priceId: 'starter',
    popular: false,
  },
  {
    name: 'Pro',
    price: 199,
    description: 'For serious players committed to improvement',
    features: [
      'Unlimited weekly sessions',
      'You.Prjct app + premium content',
      '25% off camps & clinics',
      'Video analysis (monthly)',
      'Priority event registration',
      'Quarterly 1-on-1 coaching',
    ],
    priceId: 'pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 399,
    description: 'College-prep training for the dedicated athlete',
    features: [
      'Everything in Pro',
      'Weekly 1-on-1 sessions',
      '50% off camps & clinics',
      'College recruiting guidance',
      'Custom training program',
      'Direct coach access',
      'Exclusive elite-only events',
    ],
    priceId: 'elite',
    popular: false,
  },
]

export default function MembershipPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
      setUser(user)
    })
  }, [supabase.auth])

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      window.location.href = '/auth/login?redirect=/membership'
      return
    }

    setLoading(priceId)

    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error creating subscription. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Error creating subscription. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="section">
        <div className="container">
          <div className="section-header mb-12">
            <span className="eyebrow">Membership</span>
            <h1 className="mt-4">Invest in Your Development</h1>
            <p className="text-xl max-w-[600px] mx-auto mt-4">
              Join Cincinnati Lacrosse Academy and get consistent, structured training
              that accelerates your growth as a player.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-[100px]">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`pricing-card ${plan.popular ? 'featured' : ''}`}
              >
                <h3 className="pricing-name">{plan.name}</h3>
                <p className="text-muted mb-6">
                  {plan.description}
                </p>
                <div className="pricing-price">
                  ${plan.price}<span>/month</span>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} w-full`}
                >
                  {loading === plan.priceId ? 'Processing...' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Included</span>
            <h2>What Every Member Gets</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">You.Prjct App</h3>
              <p className="feature-description">
                Access training videos, track your progress, and follow custom
                workout programs right from your phone.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Structured Training</h3>
              <p className="feature-description">
                Weekly sessions with a clear progression. No more guessing what
                to work on—we've got your development mapped out.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Event Discounts</h3>
              <p className="feature-description">
                Save on camps, clinics, and tournaments. The more you train,
                the more you save.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Community</h3>
              <p className="feature-description">
                Train alongside motivated players and access our network of
                coaches, alumni, and lacrosse professionals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">
                Regular assessments and video analysis so you can see exactly
                how you're improving over time.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏅</div>
              <h3 className="feature-title">Priority Access</h3>
              <p className="feature-description">
                Members get first access to register for popular camps and
                special events before they sell out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">FAQ</span>
            <h2>Common Questions</h2>
          </div>

          <div className="max-w-[720px] mx-auto">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your membership at any time. Your access continues until the end of your billing period.',
              },
              {
                q: 'What ages are the programs for?',
                a: 'We have programs for players ages 8-18. Adult training is available through private sessions.',
              },
              {
                q: 'Do I need my own equipment?',
                a: 'Yes, players should have their own stick, helmet, and gloves. We have limited equipment available for beginners.',
              },
              {
                q: 'Where do training sessions take place?',
                a: 'We train at multiple locations around Cincinnati. Members receive the full schedule with locations.',
              },
              {
                q: 'Can I upgrade my plan later?',
                a: 'Absolutely. You can upgrade your membership at any time and the difference is prorated.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="py-6 border-b border-border"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {item.q}
                </h3>
                <p className="text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-foreground text-white">
        <div className="container text-center">
          <h2 className="text-3xl sm:text-4xl text-white mb-4">Ready to Commit?</h2>
          <p className="text-white/70 text-xl max-w-[500px] mx-auto mb-8">
            Start training with the best. Your development begins today.
          </p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 36px',
              background: '#ffffff',
              color: '#1A1A1A',
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: '9999px',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Choose Your Plan
          </Link>
        </div>
      </section>
    </main>
  )
}
