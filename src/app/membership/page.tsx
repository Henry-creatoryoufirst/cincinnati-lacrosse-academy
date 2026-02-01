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
        body: JSON.stringify({ priceId }),
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
    <main style={{ paddingTop: '72px' }}>
      {/* Hero */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '48px' }}>
            <span className="eyebrow">Membership</span>
            <h1 style={{ marginTop: '16px' }}>Invest in Your Development</h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '16px auto 0' }}>
              Join Cincinnati Lacrosse Academy and get consistent, structured training
              that accelerates your growth as a player.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section style={{ paddingBottom: '100px' }}>
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`pricing-card ${plan.popular ? 'featured' : ''}`}
              >
                <h3 className="pricing-name">{plan.name}</h3>
                <p style={{ color: 'var(--foreground-muted)', marginBottom: '24px' }}>
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
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
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

          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
                style={{
                  padding: '24px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>
                  {item.q}
                </h3>
                <p style={{ color: 'var(--foreground-muted)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--foreground)', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Ready to Commit?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', maxWidth: '500px', margin: '0 auto 32px' }}>
            Start training with the best. Your development begins today.
          </p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="btn btn-lg"
            style={{ background: 'white', color: 'var(--foreground)' }}
          >
            Choose Your Plan
          </Link>
        </div>
      </section>
    </main>
  )
}
