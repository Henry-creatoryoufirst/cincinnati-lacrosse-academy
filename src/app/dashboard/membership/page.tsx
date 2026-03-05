'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Star, Zap, Crown, Loader2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, MEMBERSHIP_PLANS } from '@/lib/stripe'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  past_due: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-gray-100 text-gray-700',
}

const planIcons: Record<string, { icon: typeof Star; bg: string; color: string }> = {
  starter: { icon: Star, bg: 'bg-gray-100', color: 'text-gray-600' },
  pro: { icon: Zap, bg: 'bg-primary/10', color: 'text-primary' },
  elite: { icon: Crown, bg: 'bg-yellow-100', color: 'text-yellow-600' },
}

interface MembershipRow {
  id: string
  plan_id: string
  status: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export default function MembershipPage() {
  const router = useRouter()
  const [membership, setMembership] = useState<MembershipRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/dashboard/membership')
        return
      }

      const { data } = await supabase
        .from('memberships')
        .select('id, plan_id, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'past_due'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setMembership(data)
      setLoading(false)
    }
    load()
  }, [router])

  const handleManage = async () => {
    setActionLoading('manage')
    try {
      const res = await fetch('/api/stripe/create-portal-session', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setActionLoading(null)
    }
  }

  const handleSubscribe = async (planId: string) => {
    setActionLoading(planId)
    try {
      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const activePlan = membership
    ? MEMBERSHIP_PLANS[membership.plan_id as keyof typeof MEMBERSHIP_PLANS]
    : null

  return (
    <div className="min-h-screen bg-secondary pt-[72px] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Membership</h1>
          <p className="text-muted mt-1">Manage your plan and explore upgrade options.</p>
        </div>

        {/* Current Plan Summary */}
        {membership && activePlan ? (
          <Card className="mb-10">
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-foreground">{activePlan.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[membership.status] || 'bg-gray-100 text-gray-700'}`}>
                      {membership.status.replace('_', ' ')}
                    </span>
                    {membership.cancel_at_period_end && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Cancels at period end
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mb-3">
                    {membership.cancel_at_period_end
                      ? `Access until ${new Date(membership.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                      : `Renews on ${new Date(membership.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                    }
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activePlan.features.map((feature) => (
                      <span key={feature} className="inline-flex items-center px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground">
                        <CheckCircle className="w-3 h-3 mr-1 text-primary" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 space-y-2">
                  <p className="text-3xl font-bold text-foreground">
                    {formatPrice(activePlan.price)}
                    <span className="text-sm font-normal text-muted">/{activePlan.interval}</span>
                  </p>
                  <button
                    onClick={handleManage}
                    disabled={actionLoading === 'manage'}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-[1.5px] border-border text-foreground text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:border-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === 'manage' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    Manage Subscription
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-10">
            <CardContent className="text-center py-10">
              <Star className="w-12 h-12 text-muted mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Active Membership</h2>
              <p className="text-muted">Choose a plan below to unlock member benefits and discounted event pricing.</p>
            </CardContent>
          </Card>
        )}

        {/* Plan Comparison */}
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {membership ? 'Compare Plans' : 'Choose a Plan'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(MEMBERSHIP_PLANS).map((plan) => {
            const isCurrent = membership?.plan_id === plan.id
            const iconCfg = planIcons[plan.id] || planIcons.starter
            const Icon = iconCfg.icon
            return (
              <Card key={plan.id} className={`${isCurrent ? 'ring-2 ring-primary' : ''} ${plan.popular ? 'relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${iconCfg.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${iconCfg.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {formatPrice(plan.price)}
                    <span className="text-sm font-normal text-muted">/{plan.interval}</span>
                  </p>
                  {isCurrent && (
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 border-[1.5px] border-border text-foreground text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:border-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : membership ? (
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 border-[1.5px] border-border text-foreground text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:border-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleManage}
                      disabled={actionLoading === 'manage'}
                    >
                      {actionLoading === 'manage' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Change Plan
                    </button>
                  ) : (
                    <button
                      className={`w-full ${plan.popular
                        ? 'inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-foreground text-white text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:bg-[#333] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'inline-flex items-center justify-center gap-2 px-7 py-3.5 border-[1.5px] border-border text-foreground text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:border-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={actionLoading === plan.id}
                    >
                      {actionLoading === plan.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Subscribe
                    </button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
