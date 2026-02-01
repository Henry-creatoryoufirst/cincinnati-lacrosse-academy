import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, Filter, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { formatPrice } from '@/lib/stripe'

// Mock data - in production this would come from Supabase
const events = [
  {
    id: '1',
    title: 'Spring Training Camp',
    description: 'Intensive 3-day camp focusing on fundamentals, game IQ, and position-specific training.',
    event_type: 'camp',
    start_date: '2025-03-15',
    end_date: '2025-03-17',
    location: 'CLA Training Center',
    address: '123 Lacrosse Way, Cincinnati, OH',
    max_participants: 50,
    current_participants: 32,
    price: 299,
    member_price: 249,
    skill_levels: ['intermediate', 'advanced'],
    age_groups: ['12-14', '15-18'],
  },
  {
    id: '2',
    title: 'Youth Skills Clinic',
    description: 'Perfect for beginners looking to learn the basics of lacrosse in a fun environment.',
    event_type: 'clinic',
    start_date: '2025-03-22',
    end_date: '2025-03-22',
    location: 'Kennedy Heights Park',
    address: '6625 Montgomery Rd, Cincinnati, OH',
    max_participants: 30,
    current_participants: 18,
    price: 75,
    member_price: 50,
    skill_levels: ['beginner'],
    age_groups: ['8-11'],
  },
  {
    id: '3',
    title: 'Elite Player Showcase',
    description: 'Showcase your skills in front of college coaches. Video highlights included.',
    event_type: 'tournament',
    start_date: '2025-04-05',
    end_date: '2025-04-06',
    location: 'University of Cincinnati',
    address: '2751 O\'Varsity Way, Cincinnati, OH',
    max_participants: 100,
    current_participants: 67,
    price: 175,
    member_price: 150,
    skill_levels: ['advanced', 'elite'],
    age_groups: ['15-18'],
  },
  {
    id: '4',
    title: 'Weekly Training Session',
    description: 'Regular training sessions to hone your skills. Available every Saturday.',
    event_type: 'training',
    start_date: '2025-03-08',
    end_date: '2025-03-08',
    location: 'CLA Training Center',
    address: '123 Lacrosse Way, Cincinnati, OH',
    max_participants: 25,
    current_participants: 15,
    price: 35,
    member_price: 0,
    skill_levels: ['beginner', 'intermediate', 'advanced'],
    age_groups: ['10-18'],
  },
  {
    id: '5',
    title: 'Summer Lacrosse Camp',
    description: 'Week-long immersive camp with daily training, scrimmages, and team building activities.',
    event_type: 'camp',
    start_date: '2025-06-16',
    end_date: '2025-06-20',
    location: 'Miami University',
    address: '501 E High St, Oxford, OH',
    max_participants: 80,
    current_participants: 45,
    price: 599,
    member_price: 499,
    skill_levels: ['intermediate', 'advanced', 'elite'],
    age_groups: ['12-18'],
  },
  {
    id: '6',
    title: 'Goalie Academy',
    description: 'Specialized training for goalies of all levels. Focus on positioning, saves, and clearing.',
    event_type: 'clinic',
    start_date: '2025-04-12',
    end_date: '2025-04-12',
    location: 'CLA Training Center',
    address: '123 Lacrosse Way, Cincinnati, OH',
    max_participants: 15,
    current_participants: 8,
    price: 95,
    member_price: 75,
    skill_levels: ['beginner', 'intermediate', 'advanced'],
    age_groups: ['10-18'],
  },
]

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

export default function EventsPage() {
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

      {/* Filters Section */}
      <section className="bg-white border-b border-border sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
                All Events
              </button>
              <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-cyan-100 transition-colors">
                Camps
              </button>
              <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-cyan-100 transition-colors">
                Clinics
              </button>
              <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-cyan-100 transition-colors">
                Tournaments
              </button>
              <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-cyan-100 transition-colors">
                Training
              </button>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
                <Filter className="w-5 h-5 text-muted" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.start_date)}
                      {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <Users className="w-4 h-4 mr-2" />
                      Ages {event.age_groups.join(', ')}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.skill_levels.map((level) => (
                      <span key={level} className="px-2 py-1 bg-secondary rounded text-xs text-muted capitalize">
                        {level}
                      </span>
                    ))}
                  </div>

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
