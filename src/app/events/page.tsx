import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { formatPrice } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

interface EventData {
  id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date: string
  location: string
  address?: string
  max_participants: number
  current_participants: number
  price: number
  member_price?: number
  skill_levels: string[]
  age_groups: string[]
  is_active?: boolean
}

async function getEvents(): Promise<EventData[] | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (error || !data || data.length === 0) {
      return null
    }
    return data
  } catch {
    return null
  }
}

const eventTypeColors: Record<string, string> = {
  camp: 'bg-blue-100 text-blue-700',
  clinic: 'bg-green-100 text-green-700',
  tournament: 'bg-purple-100 text-purple-700',
  training: 'bg-cyan-100 text-cyan-700',
  scrimmage: 'bg-orange-100 text-orange-700',
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events</h1>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Browse and book our training sessions, camps, clinics, and tournaments. Find the perfect event to elevate your game.
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!events || events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Upcoming Events</h2>
              <p className="text-muted mb-6">Check back soon — new training sessions, camps, and clinics are added regularly.</p>
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} hover className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-primary/30" />
                </div>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${eventTypeColors[event.event_type]}`}>
                      {event.event_type}
                    </span>
                    <span className="text-sm text-muted">
                      {event.current_participants}/{event.max_participants} spots
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      {formatDate(event.start_date)}
                      {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      {event.location}
                    </div>
                    {event.age_groups && event.age_groups.length > 0 && (
                      <div className="flex items-center text-sm text-muted">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        Ages {event.age_groups.join(', ')}
                      </div>
                    )}
                  </div>

                  {event.skill_levels && event.skill_levels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.skill_levels.map((level) => (
                        <span key={level} className="px-2 py-1 bg-secondary rounded text-xs text-muted capitalize">
                          {level}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-2xl font-bold text-primary">{formatPrice(event.price)}</p>
                      {event.member_price !== undefined && event.member_price < event.price && (
                        <p className="text-sm text-green-600">{formatPrice(event.member_price)} for members</p>
                      )}
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-xl text-muted mb-8">
            Contact us to learn about private coaching, team training, or custom events.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Us</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
