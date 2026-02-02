'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: 'info@cincinnatilaxtv.com',
    link: 'mailto:info@cincinnatilaxtv.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: '(513) 555-1234',
    link: 'tel:+15135551234',
  },
  {
    icon: MapPin,
    title: 'Location',
    details: 'Cincinnati, OH',
    link: null,
  },
  {
    icon: Clock,
    title: 'Hours',
    details: 'Mon-Fri: 4PM-9PM, Sat-Sun: 8AM-6PM',
    link: null,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSuccess(true)
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-secondary">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h2>
            <p className="text-muted mb-6">
              Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Have questions about our programs? Want to learn more about membership? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>

              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.link ? (
                      <a href={item.link} className="text-muted hover:text-primary transition-colors">
                        {item.details}
                      </a>
                    ) : (
                      <p className="text-muted">{item.details}</p>
                    )}
                  </div>
                </div>
              ))}

              <Card className="mt-8">
                <CardContent>
                  <h3 className="font-semibold text-foreground mb-3">Follow Us</h3>
                  <p className="text-muted text-sm mb-4">
                    Stay connected with CLA on social media for training tips, event updates, and lacrosse content.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://youtube.com/@theschertzingertwins?si=xNoJs0yxNOsK_snw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                      YT
                    </a>
                    <a href="https://www.instagram.com/cincinnati_lax_acdmy?igsh=OXBqeGs5cmtyNjdy&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                      IG
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-foreground">Send Us a Message</h2>
                  <p className="text-muted">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        id="name"
                        name="name"
                        label="Full Name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Phone Number (optional)"
                        placeholder="(513) 555-1234"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="membership">Membership Inquiry</option>
                          <option value="events">Events & Programs</option>
                          <option value="private">Private Coaching</option>
                          <option value="team">Team Training</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto" isLoading={isLoading}>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Us</h2>
            <p className="text-xl text-muted">Visit our training center in Cincinnati</p>
          </div>
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">CLA Training Center</p>
              <p className="text-muted">Cincinnati, OH</p>
              <p className="text-sm text-muted mt-4">Map integration available with Google Maps API</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
