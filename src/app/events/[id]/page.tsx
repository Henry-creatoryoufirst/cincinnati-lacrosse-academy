'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { formatPrice } from '@/lib/stripe'

// Mock data - in production this would come from Supabase
const events: Record<string, {
  id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date: string
  location: string
  address: string
  max_participants: number
  current_participants: number
  price: number
  member_price: number
  skill_levels: string[]
  age_groups: string[]
  details: string[]
  schedule: { time: string; activity: string }[]
  includes: string[]
}> = {
  '1': {
    id: '1',
    title: 'Spring Training Camp',
    description: 'Intensive 3-day camp focusing on fundamentals, game IQ, and position-specific training. This camp is designed for players who want to take their game to the next level before the spring season.',
    event_type: 'camp',
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
    details: [
      'Professional coaching staff with D1 and MLL experience',
      'Position-specific training sessions',
      'Film review and game analysis',
      'Strength and conditioning components',
      'Scrimmages with video recording',
    ],
    schedule: [
      { time: '8:00 AM', activity: 'Check-in and warm-up' },
      { time: '9:00 AM', activity: 'Skill stations' },
      { time: '11:00 AM', activity: 'Position training' },
      { time: '12:00 PM', activity: 'Lunch break' },
      { time: '1:00 PM', activity: 'Team concepts' },
      { time: '3:00 PM', activity: 'Scrimmages' },
      { time: '5:00 PM', activity: 'Cool down and dismissal' },
    ],
    includes: [
      'Camp t-shirt',
      'Lunch provided each day',
      'Video highlights',
      'Player evaluation report',
      'Certificate of completion',
    ],
  },
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<'regular' | 'member'>('regular')

  const event = events[params.id as string]

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const spotsLeft = event.max_participants - event.current_participants
  const isSoldOut = spotsLeft <= 0
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0

  const handleBooking = async () => {
    setIsLoading(true)
    // In production, this would create a Stripe checkout session
    router.push(`/events/book?event=${event.id}&price=${selectedPrice}`)
  }

  return (
    <>
      {/* Back Button */}
      <div className="bg-secondary py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Event Header */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium capitalize mb-4">
                {event.event_type}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
              <p className="text-xl text-cyan-100 mb-8">{event.description}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-cyan-200">Date</p>
                    <p className="font-medium">{formatDate(event.start_date)}</p>
                    {event.start_date !== event.end_date && (
                      <p className="font-medium">to {formatDate(event.end_date)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-cyan-200">Location</p>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-cyan-200">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-cyan-200">Capacity</p>
                    <p className="font-medium">{spotsLeft} spots remaining</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-cyan-200">Ages</p>
                    <p className="font-medium">{event.age_groups.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div>
              <Card className="bg-white text-foreground">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Book Your Spot</h3>
                </CardHeader>
                <CardContent>
                  {isSoldOut ? (
                    <div className="text-center py-4">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-red-500">Sold Out</p>
                      <p className="text-sm text-muted mt-2">Join the waitlist to be notified of cancellations.</p>
                      <Button className="w-full mt-4" variant="outline">Join Waitlist</Button>
                    </div>
                  ) : (
                    <>
                      {isAlmostFull && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-yellow-700 font-medium">Only {spotsLeft} spots left!</p>
                        </div>
                      )}

                      <div className="space-y-3 mb-6">
                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPrice === 'regular' ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50'}`}>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="price"
                              checked={selectedPrice === 'regular'}
                              onChange={() => setSelectedPrice('regular')}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="ml-3 font-medium">Regular Price</span>
                          </div>
                          <span className="text-xl font-bold text-primary">{formatPrice(event.price)}</span>
                        </label>

                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPrice === 'member' ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50'}`}>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="price"
                              checked={selectedPrice === 'member'}
                              onChange={() => setSelectedPrice('member')}
                              className="w-4 h-4 text-primary"
                            />
                            <div className="ml-3">
                              <span className="font-medium">Member Price</span>
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Save {formatPrice(event.price - event.member_price)}</span>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-primary">{formatPrice(event.member_price)}</span>
                        </label>
                      </div>

                      <Button className="w-full" size="lg" onClick={handleBooking} isLoading={isLoading}>
                        Continue to Payment
                      </Button>

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
      </section>

      {/* Event Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">What You&apos;ll Learn</h2>
                <ul className="space-y-3">
                  {event.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-muted">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Daily Schedule */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Daily Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-secondary rounded-xl">
                      <div className="w-20 text-sm font-medium text-primary">{item.time}</div>
                      <div className="text-foreground">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Levels */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Who Should Attend</h2>
                <div className="flex flex-wrap gap-2">
                  {event.skill_levels.map((level) => (
                    <span key={level} className="px-4 py-2 bg-secondary rounded-lg text-foreground capitalize">
                      {level} Players
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">What&apos;s Included</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {event.includes.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Questions?</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted mb-4">Have questions about this event? We&apos;re here to help.</p>
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
