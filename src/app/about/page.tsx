import Link from 'next/link'
import { Users, Target, Award, Heart, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from coaching to facilities to player development.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a supportive community where players, families, and coaches grow together.',
  },
  {
    icon: Heart,
    title: 'Character',
    description: 'Developing not just great players, but great people who lead with integrity.',
  },
  {
    icon: Award,
    title: 'Growth',
    description: 'Fostering continuous improvement and a love for the game at every skill level.',
  },
]

const team = [
  {
    name: 'Coach Mike Thompson',
    role: 'Head Coach & Founder',
    bio: 'Former D1 All-American at Ohio State and 5-year MLL veteran. Founded CLA in 2014 with a vision to grow lacrosse in Cincinnati.',
  },
  {
    name: 'Coach Sarah Williams',
    role: 'Director of Player Development',
    bio: 'Two-time NCAA champion at Northwestern. Specializes in stick skills and offensive strategy.',
  },
  {
    name: 'Coach David Chen',
    role: 'Defensive Coordinator',
    bio: '10+ years of coaching experience. Former Division 1 player at Johns Hopkins with expertise in team defense.',
  },
  {
    name: 'Coach Emily Rodriguez',
    role: 'Youth Program Director',
    bio: 'Passionate about introducing young players to lacrosse. Certified youth sports coach with a background in education.',
  },
]

const stats = [
  { number: '500+', label: 'Players Trained' },
  { number: '50+', label: 'College Commits' },
  { number: '10+', label: 'Years Experience' },
  { number: '15+', label: 'Expert Coaches' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Cincinnati Lacrosse Academy</h1>
            <p className="text-xl text-cyan-100">
              Founded in 2014, Cincinnati Lacrosse Academy has grown from a small training program to the region&apos;s premier lacrosse development organization. Our mission is to grow the sport of lacrosse in Greater Cincinnati while developing players of character.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted mb-6">
                At Cincinnati Lacrosse Academy, we believe lacrosse is more than just a sport—it&apos;s a vehicle for personal growth, teamwork, and community building.
              </p>
              <p className="text-lg text-muted mb-6">
                Our mission is to provide the highest quality lacrosse instruction and competitive opportunities while developing athletes who excel on and off the field. We emphasize skill development, game IQ, and character building in all our programs.
              </p>
              <p className="text-lg text-muted">
                Whether you&apos;re a beginner picking up a stick for the first time or an elite player preparing for college recruitment, CLA has a program designed to help you reach your goals.
              </p>
            </div>
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-white font-bold text-3xl">CLA</span>
                </div>
                <p className="text-lg font-semibold text-foreground">Developing Champions</p>
                <p className="text-muted">Since 2014</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              These values guide everything we do at Cincinnati Lacrosse Academy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} hover>
                <CardContent className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Coaching Staff</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Our coaches bring decades of playing and coaching experience at the highest levels.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.name} hover>
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground text-center mb-1">{member.name}</h3>
                  <p className="text-primary text-sm text-center mb-4">{member.role}</p>
                  <p className="text-muted text-sm text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Story</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  &apos;14
                </div>
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">Founded</h3>
                <p className="text-muted">Coach Mike Thompson starts CLA with just 12 players training at a local park. The vision: bring quality lacrosse instruction to Cincinnati.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  &apos;17
                </div>
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">First Training Center</h3>
                <p className="text-muted">CLA opens its first dedicated training facility, allowing year-round programming and expanding to over 100 active players.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  &apos;20
                </div>
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">Digital Expansion</h3>
                <p className="text-muted">Launch of YouTube channel and podcast, bringing lacrosse content to thousands of players beyond Cincinnati.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  Now
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Growing Strong</h3>
                <p className="text-muted">With 500+ players trained, 50+ college commits, and a team of 15+ coaches, CLA continues to be the premier lacrosse development program in Greater Cincinnati.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the CLA Family</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Whether you&apos;re just starting out or looking to take your game to the next level, we have a program for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary hover:bg-cyan-50">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
