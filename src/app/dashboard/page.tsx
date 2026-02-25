import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, CreditCard, User, Clock, ArrowRight, CheckCircle, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ booking?: string; subscription?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const resolvedParams = await searchParams

  // Fetch profile (admin check + membership)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, membership_status, membership_plan')
    .eq('user_id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // Fetch upcoming bookings with event data
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

  // Fetch membership
  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Count attended sessions
  const { count: sessionsAttended } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'attended')

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Athlete'
  const bookings: Array<{ id: string; status: string; amount_paid: number; event_id: string; events: unknown }> = upcomingBookings || []
  const membershipActive = profile?.membership_status === 'active'

  return (
    <div className="min-h-screen bg-gray-100 pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Success Banners */}
        {resolvedParams?.booking === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <p className="text-green-700 font-medium text-sm">Booking confirmed! You&apos;re all set.</p>
          </div>
        )}
        {resolvedParams?.subscription === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <p className="text-green-700 font-medium text-sm">Membership activated! Welcome to the family.</p>
          </div>
        )}

        {/* Welcome Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Manage your bookings, membership, and account settings.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            { icon: Calendar, label: 'Upcoming', value: String(bookings.length), color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: CheckCircle, label: 'Membership', value: membershipActive ? 'Active' : 'None', color: membershipActive ? 'text-green-600' : 'text-gray-400', bg: membershipActive ? 'bg-green-50' : 'bg-gray-100' },
            { icon: Clock, label: 'Attended', value: String(sessionsAttended || 0), color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: CreditCard, label: 'Plan', value: membership?.plan_id ? membership.plan_id.charAt(0).toUpperCase() + membership.plan_id.slice(1) : 'Free', color: 'text-cyan-600', bg: 'bg-cyan-50' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm min-w-0"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-3 sm:mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight truncate">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Upcoming Events — Main Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8 min-w-0">

            {/* Upcoming Events Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <Link
                  href="/dashboard/bookings"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-2">
                {bookings.length > 0 ? (
                  <div>
                    {bookings.map((booking, index) => {
                      const evt = booking.events as unknown as {
                        id: string; title: string; start_date: string;
                        end_date: string; location: string; event_type: string
                      } | null
                      if (!evt) return null
                      return (
                        <div
                          key={booking.id}
                          className={`flex items-center justify-between p-4 rounded-xl ${
                            index === 0 ? 'bg-gray-50' : ''
                          } ${index < bookings.length - 1 ? 'mb-1' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                                {evt.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {new Date(evt.start_date).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })}
                                {' \u00B7 '}
                                {new Date(evt.start_date).toLocaleTimeString('en-US', {
                                  hour: 'numeric', minute: '2-digit'
                                })}
                              </p>
                              <p className="text-xs text-gray-400">
                                {evt.location}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
                            booking.status === 'confirmed'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4 text-sm">No upcoming events</p>
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions — Grid */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  ...(isAdmin ? [{ href: '/dashboard/admin', icon: ShieldCheck, label: 'Admin Dashboard', sublabel: 'Manage site', color: 'text-red-600', bg: 'bg-red-50' }] : []),
                  { href: '/events', icon: Calendar, label: 'Book Event', sublabel: 'Browse & register', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { href: '/dashboard/profile', icon: User, label: 'Edit Profile', sublabel: 'Update your info', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing', sublabel: 'View history', color: 'text-cyan-600', bg: 'bg-cyan-50' },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex items-center gap-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${action.bg} flex items-center justify-center flex-shrink-0`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {action.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {action.sublabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Membership Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Membership
                </h2>
              </div>
              <div className="p-6">
                {membershipActive && membership ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Plan</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{membership.plan_id}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 capitalize">
                        {membership.status}
                      </span>
                    </div>
                    {membership.current_period_end && (
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-gray-500">Next Billing</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(membership.current_period_end).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-4">No active membership</p>
                  </div>
                )}

                <Link
                  href={membershipActive ? '/dashboard/membership' : '/membership'}
                  className="flex items-center justify-center gap-1.5 w-full py-3 border-2 border-blue-600 rounded-xl text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
                >
                  {membershipActive ? 'Manage Membership' : 'View Plans'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-7 text-white relative overflow-hidden">
              <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-3 w-20 h-20 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-white/80 mb-5 leading-relaxed">
                  Have questions about your account or upcoming events?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
