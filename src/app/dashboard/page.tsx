import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ booking?: string; subscription?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const resolvedParams = await searchParams

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, membership_status, membership_plan')
    .eq('user_id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      amount_paid,
      event_id,
      events (
        id,
        title,
        start_date,
        end_date,
        location,
        event_type
      )
    `)
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'pending'])
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { count: sessionsAttended } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'attended')

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Athlete'
  const bookings: Array<{ id: string; status: string; amount_paid: number; event_id: string; events: unknown }> = upcomingBookings || []
  const membershipActive = profile?.membership_status === 'active'

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
  } as const

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', paddingTop: '72px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Success Banners */}
        {resolvedParams?.booking === 'success' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#16a34a', fontSize: '1rem' }}>✓</span>
            <p style={{ color: '#15803d', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Booking confirmed! You&apos;re all set.</p>
          </div>
        )}
        {resolvedParams?.subscription === 'success' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#16a34a', fontSize: '1rem' }}>✓</span>
            <p style={{ color: '#15803d', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Membership activated! Welcome to the family.</p>
          </div>
        )}

        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Manage your bookings, membership, and account settings.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Upcoming', value: String(bookings.length), emoji: '📅' },
            { label: 'Membership', value: membershipActive ? 'Active' : 'None', emoji: '✓' },
            { label: 'Attended', value: String(sessionsAttended || 0), emoji: '⏱' },
            { label: 'Plan', value: membership?.plan_id ? membership.plan_id.charAt(0).toUpperCase() + membership.plan_id.slice(1) : 'Free', emoji: '💳' },
          ].map((stat) => (
            <div key={stat.label} style={{ ...cardStyle, padding: '20px' }}>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Upcoming Events */}
            <div style={cardStyle}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
                  Upcoming Events
                </h2>
                <Link
                  href="/dashboard/bookings"
                  style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', textDecoration: 'none' }}
                >
                  View All →
                </Link>
              </div>

              <div style={{ padding: '8px' }}>
                {bookings.length > 0 ? (
                  <div>
                    {bookings.map((booking) => {
                      const evt = booking.events as unknown as {
                        id: string; title: string; start_date: string;
                        end_date: string; location: string; event_type: string
                      } | null
                      if (!evt) return null
                      return (
                        <div
                          key={booking.id}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '8px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                              📅
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '2px' }}>
                                {evt.title}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                                {new Date(evt.start_date).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })}
                                {' · '}
                                {new Date(evt.start_date).toLocaleTimeString('en-US', {
                                  hour: 'numeric', minute: '2-digit'
                                })}
                                {evt.location && ` · ${evt.location}`}
                              </p>
                            </div>
                          </div>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            letterSpacing: '0.02em',
                            background: booking.status === 'confirmed' ? '#f0fdf4' : '#fefce8',
                            color: booking.status === 'confirmed' ? '#15803d' : '#a16207',
                          }}>
                            {booking.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '16px' }}>No upcoming events</p>
                    <Link
                      href="/events"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '9px 20px',
                        background: '#0a0a0a',
                        color: '#fff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '12px' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ...(isAdmin ? [{ href: '/dashboard/admin', label: 'Admin Dashboard', sublabel: 'Manage site', emoji: '🛡️' }] : []),
                  { href: '/events', label: 'Book Event', sublabel: 'Browse & register', emoji: '📅' },
                  { href: '/dashboard/profile', label: 'Edit Profile', sublabel: 'Update your info', emoji: '👤' },
                  { href: '/dashboard/billing', label: 'Billing', sublabel: 'View history', emoji: '💳' },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    style={{ ...cardStyle, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                      {action.emoji}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '1px' }}>
                        {action.label}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                        {action.sublabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Membership */}
            <div style={cardStyle}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
                  Membership
                </h2>
              </div>
              <div style={{ padding: '20px' }}>
                {membershipActive && membership ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Plan</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a', textTransform: 'capitalize' }}>{membership.plan_id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Status</span>
                      <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 600, background: '#f0fdf4', color: '#15803d', textTransform: 'capitalize' }}>
                        {membership.status}
                      </span>
                    </div>
                    {membership.current_period_end && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Next Billing</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a' }}>
                          {new Date(membership.current_period_end).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '16px' }}>No active membership</p>
                  </div>
                )}

                <Link
                  href={membershipActive ? '/dashboard/membership' : '/membership'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '10px 16px',
                    background: '#0a0a0a',
                    color: '#fff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  {membershipActive ? 'Manage Membership' : 'View Plans'}
                </Link>
              </div>
            </div>

            {/* Need Help */}
            <div style={{ ...cardStyle, padding: '20px' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '6px' }}>
                Need Help?
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '16px' }}>
                Questions about your account or upcoming events?
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '10px 16px',
                  background: '#f5f5f5',
                  color: '#0a0a0a',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
