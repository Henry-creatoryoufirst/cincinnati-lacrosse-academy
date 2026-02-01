'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, User, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { formatPrice } from '@/lib/stripe'

// Mock event data
const events: Record<string, { title: string; price: number; member_price: number; date: string }> = {
  '1': { title: 'Spring Training Camp', price: 299, member_price: 249, date: 'March 15-17, 2025' },
}

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = searchParams.get('event')
  const priceType = searchParams.get('price') || 'regular'

  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    participantName: '',
    participantAge: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    agreeToTerms: false,
  })

  const supabase = createClient()
  const event = eventId ? events[eventId] : null
  const price = priceType === 'member' && event ? event.member_price : event?.price || 0

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/auth/login?redirect=/events/book?event=${eventId}&price=${priceType}`)
        return
      }
      setUser(user)
      setFormData(prev => ({
        ...prev,
        participantName: user.user_metadata?.full_name || '',
      }))
    }
    getUser()
  }, [supabase, router, eventId, priceType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else {
      handlePayment()
    }
  }

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      // In production, this would call your Stripe API endpoint
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          priceId: 'price_placeholder', // Would be actual Stripe price ID
          mode: 'payment',
          successUrl: `${window.location.origin}/dashboard?booking=success`,
          cancelUrl: `${window.location.origin}/events/${eventId}`,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href={`/events/${eventId}`} className="inline-flex items-center text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Event
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-border text-muted'}`}>
              <User className="w-5 h-5" />
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-border text-muted'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-border text-muted'}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">
                  {step === 1 ? 'Participant Information' : 'Payment'}
                </h2>
              </CardHeader>
              <CardContent>
                {step === 1 ? (
                  <div className="space-y-6">
                    <Input
                      id="participantName"
                      name="participantName"
                      label="Participant Full Name"
                      value={formData.participantName}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      id="participantAge"
                      name="participantAge"
                      type="number"
                      label="Participant Age"
                      value={formData.participantAge}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      label="Emergency Contact Name"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      type="tel"
                      label="Emergency Contact Phone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <label htmlFor="medicalNotes" className="block text-sm font-medium text-foreground mb-2">
                        Medical Notes / Allergies (Optional)
                      </label>
                      <textarea
                        id="medicalNotes"
                        name="medicalNotes"
                        rows={3}
                        value={formData.medicalNotes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Any medical conditions or allergies we should know about..."
                      />
                    </div>

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary"
                        required
                      />
                      <span className="ml-2 text-sm text-muted">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>,{' '}
                        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{' '}
                        <Link href="/refunds" className="text-primary hover:underline">Refund Policy</Link>
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-secondary rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4">Payment Details</h3>
                      <p className="text-muted mb-4">
                        You&apos;ll be redirected to Stripe&apos;s secure checkout to complete your payment.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                          <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                          <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
                        </div>
                        <span className="text-sm text-muted">Secure payment via Stripe</span>
                      </div>
                    </div>

                    <div className="border border-border rounded-xl p-4">
                      <h4 className="font-medium text-foreground mb-2">Booking Summary</h4>
                      <p className="text-sm text-muted">Participant: {formData.participantName}</p>
                      <p className="text-sm text-muted">Emergency Contact: {formData.emergencyContact}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleContinue}
                    className="flex-1"
                    isLoading={isLoading}
                    disabled={step === 1 && !formData.agreeToTerms}
                  >
                    {step === 1 ? 'Continue to Payment' : `Pay ${formatPrice(price)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Order Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted">{event.date}</p>
                  </div>
                </div>

                <hr className="border-border my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Event Price</span>
                    <span className="text-foreground">{formatPrice(price)}</span>
                  </div>
                  {priceType === 'member' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Member Discount</span>
                      <span>-{formatPrice(event.price - event.member_price)}</span>
                    </div>
                  )}
                </div>

                <hr className="border-border my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatPrice(price)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookEventPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
