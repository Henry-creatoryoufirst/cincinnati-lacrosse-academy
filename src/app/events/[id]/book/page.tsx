'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, User, Calendar, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { formatPrice } from '@/lib/stripe'
import type { Event } from '@/lib/types'

export default function BookEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const supabase = createClient()

  const [eventId, setEventId] = useState<string>('')
  const [event, setEvent] = useState<Event | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [isMember, setIsMember] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    participantName: '',
    participantAge: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    agreeToTerms: false,
  })

  // Resolve params and fetch data
  useEffect(() => {
    const init = async () => {
      const { id } = await params
      setEventId(id)

      // Check auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push(`/auth/login?redirect=/events/${id}/book`)
        return
      }
      setUser(authUser)
      setFormData(prev => ({
        ...prev,
        participantName: authUser.user_metadata?.full_name || '',
      }))

      // Fetch event
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (!eventData) {
        router.push('/events')
        return
      }
      setEvent(eventData)

      // Check membership
      const { data: profile } = await supabase
        .from('profiles')
        .select('membership_status')
        .eq('user_id', authUser.id)
        .single()

      setIsMember(profile?.membership_status === 'active')
      setIsLoading(false)
    }
    init()
  }, [params, supabase, router])

  const price = event
    ? (isMember && event.member_price != null && event.member_price < event.price
        ? event.member_price
        : event.price)
    : 0

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
      handleStripePayment()
    }
  }

  const handleStripePayment = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          participantName: formData.participantName,
          participantAge: formData.participantAge ? parseInt(formData.participantAge) : null,
          emergencyContactName: formData.emergencyContact,
          emergencyContactPhone: formData.emergencyPhone,
          medicalNotes: formData.medicalNotes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to process booking')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const spotsLeft = event.max_participants - event.current_participants

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Event
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <User className="w-5 h-5" />
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
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
                      <label htmlFor="medicalNotes" className="block text-sm font-medium text-gray-900 mb-2">
                        Medical Notes / Allergies (Optional)
                      </label>
                      <textarea
                        id="medicalNotes"
                        name="medicalNotes"
                        rows={3}
                        value={formData.medicalNotes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        placeholder="Any medical conditions or allergies we should know about..."
                      />
                    </div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>,{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, and{' '}
                        <Link href="/refunds" className="text-blue-600 hover:underline">Refund Policy</Link>
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Card Payment Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Card Payment</h3>
                      <p className="text-gray-500 mb-4">
                        You&apos;ll be redirected to Stripe&apos;s secure checkout to complete your payment.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                          <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                          <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
                        </div>
                        <span className="text-sm text-gray-500">Secure payment via Stripe</span>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                      <p className="text-sm text-gray-500">Participant: {formData.participantName}</p>
                      {formData.emergencyContact && (
                        <p className="text-sm text-gray-500">Emergency Contact: {formData.emergencyContact}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => { setStep(1); setError(null) }}>
                      Back
                    </Button>
                  )}
                  {step >= 1 && (
                    <Button
                      onClick={handleContinue}
                      className="flex-1"
                      isLoading={isSubmitting}
                      disabled={(step === 1 && !formData.agreeToTerms) || isSubmitting}
                    >
                      {step === 1 ? 'Continue to Payment' : `Pay ${formatPrice(price)}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Order Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{event.event_type}</p>
                  </div>
                </div>

                {spotsLeft <= 5 && spotsLeft > 0 && (
                  <p className="text-sm text-amber-600 font-medium mb-3">Only {spotsLeft} spots left!</p>
                )}

                <hr className="border-gray-200 my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Event Price</span>
                    <span className="text-gray-900">{formatPrice(event.price)}</span>
                  </div>
                  {isMember && event.member_price != null && event.member_price < event.price && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Member Discount</span>
                      <span>-{formatPrice(event.price - event.member_price)}</span>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200 my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">{formatPrice(price)}</span>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
