import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/stripe'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

// Fallback mock data for safety (matches Supabase schema)
const fallbackEvent = {
  id: 'fallback',
  title: 'Spring Training Camp',
  description: 'Intensive 3-day camp focusing on fundamentals, game IQ, and position-specific training. This camp is designed for players who want to take their game to the next level before the spring season.',
  event_type: 'camp' as const,
  start_date: '2025-03-15',
  end_date: '2025-03-17',
  location: 'CLA Training Center',
  address: '123 Lacrosse Way, Cincinnati, OH 45202',
  max_participants: 50,
  current_participants: 32,
  price: 299,
  member_price: 249,
  skill_levels: ['intermediate', 'advanced'],
  age_groups: ['12-14', '15-18'],
  is_active: true,
  created_at: new Date().toISOString(),
}

const whatToExpect = [
  'Professional coaching staff with D1 and MLL experience',
  'Position-specific training and skill development',
  'Film review and tactical game analysis',
  'Strength and conditioning components',
  'Live scrimmages with video recording',
  'Player evaluation report at completion',
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Fetch event from Supabase by UUID, with fallback on error/timeout
  let eventData = null
  try {
    const supabase = await createClient()
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    eventData = event
  } catch {
    // Supabase unavailable — fall through to fallback
  }

  // Use fallback mock if Supabase returned nothing
  if (!eventData && id === 'fallback') {
    eventData = fallbackEvent
  }

  if (!eventData) {
    notFound()
  }

  const spotsLeft = eventData.max_participants - eventData.current_participants
  const isSoldOut = spotsLeft <= 0
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0
  const capacityPercent = Math.round((eventData.current_participants / eventData.max_participants) * 100)

  return (
    <>
      {/* Back Navigation */}
      <div className="bg-secondary py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Event Hero Header */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Event Info */}
            <div className="lg:col-span-2">
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium capitalize mb-4">
                {eventData.event_type}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{eventData.title}</h1>
              <p className="text-xl text-cyan-100 mb-8">{eventData.description}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-cyan-200">Date</p>
                    <p className="font-medium">{formatDate(eventData.start_date)}</p>
                    {eventData.start_date !== eventData.end_date && (
                      <p className="font-medium">to {formatDate(eventData.end_date)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-cyan-200">Location</p>
                    <p className="font-medium">{eventData.location}</p>
                    {eventData.address && <p className="text-sm text-cyan-200">{eventData.address}</p>}
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-cyan-200">Capacity</p>
                    <p className="font-medium">
                      {isSoldOut ? 'Sold Out' : `${spotsLeft} spots remaining`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-cyan-200">Ages</p>
                    <p className="font-medium">{eventData.age_groups?.join(', ') || 'All ages'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Booking Sidebar */}
            <div>
              <div className="lg:sticky lg:top-24">
                <Card className="bg-white text-foreground">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Book Your Spot</h3>
                  </CardHeader>
                  <CardContent>
                    {/* Capacity Progress Bar */}
                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">{eventData.current_participants} registered</span>
                        <span className="text-muted">{eventData.max_participants} max</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            isSoldOut ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                        />
                      </div>
                      {isAlmostFull && !isSoldOut && (
                        <p className="text-sm text-yellow-600 font-medium mt-2">Only {spotsLeft} spots left!</p>
                      )}
                    </div>

                    {isSoldOut ? (
                      <div className="text-center py-4">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-red-500">Sold Out</p>
                        <p className="text-sm text-muted mt-2">Join the waitlist to be notified of cancellations.</p>
                        <Button className="w-full mt-4" variant="outline">Join Waitlist</Button>
                      </div>
                    ) : (
                      <>
                        {/* Pricing */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-secondary">
                            <span className="font-medium">Regular Price</span>
                            <span className="text-xl font-bold text-primary">{formatPrice(eventData.price)}</span>
                          </div>

                          {eventData.member_price && eventData.member_price < eventData.price && (
                            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-green-200 bg-green-50">
                              <div>
                                <span className="font-medium">Member Price</span>
                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  Save {formatPrice(eventData.price - eventData.member_price)}
                                </span>
                              </div>
                              <span className="text-xl font-bold text-green-600">{formatPrice(eventData.member_price)}</span>
                            </div>
                          )}
                        </div>

                        <Link href={`/events/${eventData.id}/book`}>
                          <Button className="w-full" size="lg">
                            Book Now
                          </Button>
                        </Link>

                        <p className="text-xs text-muted text-center mt-4">
                          Not a member?{' '}
                          <Link href="/membership" className="text-primary hover:underline">
                            Join now
                          </Link>{' '}
                          to save on this and future events.
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Body */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What to Expect */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">What to Expect</h2>
                <ul className="space-y-3">
                  {whatToExpect.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skill Levels */}
              {eventData.skill_levels && eventData.skill_levels.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Who Should Attend</h2>
                  <div className="flex flex-wrap gap-2">
                    {eventData.skill_levels.map((level: string) => (
                      <span key={level} className="px-4 py-2 bg-secondary rounded-lg text-foreground capitalize">
                        {level} Players
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Age Groups */}
              {eventData.age_groups && eventData.age_groups.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Age Groups</h2>
                  <div className="flex flex-wrap gap-2">
                    {eventData.age_groups.map((group: string) => (
                      <span key={group} className="px-4 py-2 bg-secondary rounded-lg text-foreground">
                        Ages {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Questions? Contact Us */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Questions?</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted mb-4">Have questions about this event? We&apos;re here to help.</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted">
                      <Mail className="w-4 h-4 mr-2 text-primary" />
                      info@cincinnatilacrosse.com
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <Phone className="w-4 h-4 mr-2 text-primary" />
                      (513) 555-0123
                    </div>
                  </div>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">Contact Us</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
